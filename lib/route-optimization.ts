export interface Order {
  id: string
  address: string
  neighborhood: string
  lat?: number
  lng?: number
  priority?: "high" | "normal" | "low"
}

export interface OptimizedRoute {
  neighborhood: string
  orders: Order[]
  totalDistance: number
  estimatedTime: number
  sequence: Order[]
}

/**
 * Group orders by neighborhood for batch delivery
 */
export function groupOrdersByNeighborhood(orders: Order[]): Map<string, Order[]> {
  const grouped = new Map<string, Order[]>()

  orders.forEach((order) => {
    const neighborhood = order.neighborhood
    if (!grouped.has(neighborhood)) {
      grouped.set(neighborhood, [])
    }
    grouped.get(neighborhood)?.push(order)
  })

  return grouped
}

/**
 * Sort orders within a neighborhood by proximity (nearest neighbor algorithm)
 */
export function optimizeNeighborhoodRoute(orders: Order[]): Order[] {
  if (orders.length <= 1) return orders

  // Simple nearest neighbor sorting (in production, use actual geocoding)
  const sorted = [orders[0]]
  const remaining = orders.slice(1)

  while (remaining.length > 0) {
    const lastOrder = sorted[sorted.length - 1]
    let nearestIndex = 0
    let nearestDistance = calculateDistance(
      lastOrder.lat || 0,
      lastOrder.lng || 0,
      remaining[0].lat || 0,
      remaining[0].lng || 0,
    )

    for (let i = 1; i < remaining.length; i++) {
      const distance = calculateDistance(
        lastOrder.lat || 0,
        lastOrder.lng || 0,
        remaining[i].lat || 0,
        remaining[i].lng || 0,
      )
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = i
      }
    }

    sorted.push(remaining[nearestIndex])
    remaining.splice(nearestIndex, 1)
  }

  return sorted
}

/**
 * Calculate distance between two coordinates (simplified Haversine)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Create optimized delivery batches for all neighborhoods
 */
export function createOptimizedBatches(orders: Order[]): OptimizedRoute[] {
  const grouped = groupOrdersByNeighborhood(orders)
  const batches: OptimizedRoute[] = []

  grouped.forEach((neighborhoodOrders, neighborhood) => {
    const optimizedSequence = optimizeNeighborhoodRoute(neighborhoodOrders)

    // Calculate total distance and time
    let totalDistance = 0
    for (let i = 0; i < optimizedSequence.length - 1; i++) {
      totalDistance += calculateDistance(
        optimizedSequence[i].lat || 0,
        optimizedSequence[i].lng || 0,
        optimizedSequence[i + 1].lat || 0,
        optimizedSequence[i + 1].lng || 0,
      )
    }

    const estimatedTime = Math.ceil((totalDistance / 30) * 60) + optimizedSequence.length * 3 // 30 km/h average + 3 min per stop

    batches.push({
      neighborhood,
      orders: neighborhoodOrders,
      totalDistance: Math.round(totalDistance * 10) / 10,
      estimatedTime,
      sequence: optimizedSequence,
    })
  })

  return batches.sort((a, b) => a.totalDistance - b.totalDistance)
}

/**
 * Assign drivers to batches based on neighborhood coverage
 */
export interface DriverAssignment {
  driverId: string
  driverName: string
  batch: OptimizedRoute
  assignedAt: Date
}

export function assignDriversToBatches(
  batches: OptimizedRoute[],
  availableDrivers: Array<{ id: string; name: string; neighborhood: string }>,
): DriverAssignment[] {
  const assignments: DriverAssignment[] = []

  batches.forEach((batch) => {
    const preferredDriver = availableDrivers.find((d) => d.neighborhood === batch.neighborhood)
    const assignedDriver = preferredDriver || availableDrivers[0]

    if (assignedDriver) {
      assignments.push({
        driverId: assignedDriver.id,
        driverName: assignedDriver.name,
        batch,
        assignedAt: new Date(),
      })
    }
  })

  return assignments
}
