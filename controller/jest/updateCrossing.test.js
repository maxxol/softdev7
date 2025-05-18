const { updateCrossing } = require('../src/crossing')
const {
  TRAFFIC_LIGHT_COLORS,
  crossingPedNOTIslandIdSet,
  crossingPedIslandIdSet,
  green_sets,
  crossingIdSet
} = require('../src/utils')

describe('updateCrossing', () => {
  let simulatorStatus
  let trafficLightStatus
  let greenSet
  let idQueue

  beforeEach(() => {
    trafficLightStatus = {}

    // Initialize all green set lights to RED
    Object.values(green_sets[1]).forEach(id => {
      trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED
    })

    // Set all pedestrian lights to ORANGE
    crossingPedNOTIslandIdSet.forEach(id => {
      trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.ORANGE
    })
    crossingPedIslandIdSet.forEach(id => {
      trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.ORANGE
    })

    simulatorStatus = {
      roadway: {
    ...mapSensorData([...crossingIdSet], { voor: false }),
    ...mapSensorData(green_sets[1], { voor: true })
    },
      special: { brug_file: false },
      bridge: { "81": { state: "dicht" } },
      priority_vehicle: { queue: [] }
    }

    greenSet = new Set(green_sets[1])
    idQueue = Object.values(green_sets[2]) // unused in GREEN stage but provided for shape


      function mapSensorData(ids, value) {
          return Object.fromEntries(
              Object.values(ids).map(id => [id, value])
          )
      }
  })

//   test.each([
//     [TRAFFIC_LIGHT_COLORS.RED, TRAFFIC_LIGHT_COLORS.GREEN, 'green lights set on RED stage'],
//     [TRAFFIC_LIGHT_COLORS.GREEN, TRAFFIC_LIGHT_COLORS.ORANGE, 'orange lights set on GREEN stage'],
//     [TRAFFIC_LIGHT_COLORS.ORANGE, TRAFFIC_LIGHT_COLORS.RED, 'red lights set on ORANGE stage']
//   ])('transitions from %s to %s (%s)', (startStage, expectedColor, _) => {
//     const result = updateCrossing(simulatorStatus, trafficLightStatus, greenSet, startStage, idQueue)

//     expect(result.stage).toBe(
//       startStage === TRAFFIC_LIGHT_COLORS.ORANGE ? TRAFFIC_LIGHT_COLORS.RED :
//       startStage === TRAFFIC_LIGHT_COLORS.RED ? TRAFFIC_LIGHT_COLORS.GREEN :
//       TRAFFIC_LIGHT_COLORS.ORANGE
//     )

//     greenSet.forEach(id => {
//       expect(trafficLightStatus[id]).toBe(expectedColor)
//     })
//   })

  test('priority vehicle 1 sets bridge light green and skips stage change', () => {
    simulatorStatus.priority_vehicle.queue = [{ prioriteit: 1, baan: "1.1" }]
    simulatorStatus.bridge["81"].state = "dicht"
    trafficLightStatus["1.1"] = TRAFFIC_LIGHT_COLORS.RED

    const result = updateCrossing(simulatorStatus, trafficLightStatus, greenSet, TRAFFIC_LIGHT_COLORS.RED, idQueue)

    expect(result.stage).toBe(TRAFFIC_LIGHT_COLORS.RED)
    expect(trafficLightStatus["1.1"]).toBe(TRAFFIC_LIGHT_COLORS.GREEN)
  })

  test('pedestrians on NOT island turn green, island stays red during GREEN stage', () => {
    const result = updateCrossing(simulatorStatus, trafficLightStatus, greenSet, TRAFFIC_LIGHT_COLORS.GREEN, idQueue)

    crossingPedNOTIslandIdSet.forEach(id => {
      expect(trafficLightStatus[id]).toBe(TRAFFIC_LIGHT_COLORS.GREEN)
    })

    crossingPedIslandIdSet.forEach(id => {
      expect(trafficLightStatus[id]).toBe(TRAFFIC_LIGHT_COLORS.RED)
    })

    expect(result.stage).toBe(TRAFFIC_LIGHT_COLORS.ORANGE)
  })

  test('traffic to bridge stays RED when brug_file is active', () => {
    simulatorStatus.special.brug_file = true
    const bridgeTargetingSet = new Set(["1.1"]) // Assuming this one is in trafficGoingTobridgeIdSet
    greenSet = bridgeTargetingSet
    trafficLightStatus["1.1"] = TRAFFIC_LIGHT_COLORS.RED

    const result = updateCrossing(simulatorStatus, trafficLightStatus, greenSet, TRAFFIC_LIGHT_COLORS.RED, idQueue)

    expect(trafficLightStatus["1.1"]).toBe(TRAFFIC_LIGHT_COLORS.RED)
    expect(result.stage).toBe(TRAFFIC_LIGHT_COLORS.GREEN)
  })
})