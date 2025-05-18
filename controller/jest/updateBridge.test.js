/**
 * @author Chat-GPT (& Willem Daniël Visser) with the commands: 
 * "Can you make me unitests using test.each", context: handle_traffic_light_update2.js
 * "I'd like to include utils and in index for further context. Can you write the tests again?", context: index.js, utils.js
 * 
 */
const { updateBridge } = require('../src/bridge');
const { PASS_BOAT_STATES, boatIdSet, bridgeIdSet, barrierIdSet } = require('../src/utils');

jest.useFakeTimers();

describe('updateBridge', () => {
  let trafficLightStatus;
  let bridgeState;
  let simulatorStatus;

  beforeEach(() => {
    trafficLightStatus = {};
    bridgeState = { state: PASS_BOAT_STATES.OPEN_BRIDGE };
    simulatorStatus = {
      priority_vehicle: { queue: [] },
      bridge: { "81": { state: "open" } },
      special: { brug_file: false },
      roadway: {
        [boatIdSet[0]]: { voor: false, achter: false },
        [boatIdSet[1]]: { voor: false, achter: false }
      }
    };
  });

  test.each([
    ['north sensor triggered', { voor: true, achter: false }, { voor: false, achter: false }, PASS_BOAT_STATES.PASS_BOAT_NORTH],
    ['south sensor triggered', { voor: false, achter: false }, { voor: true, achter: false }, PASS_BOAT_STATES.PASS_BOAT_SOUTH],
    ['no sensors triggered', { voor: false, achter: false }, { voor: false, achter: false }, PASS_BOAT_STATES.AWAITING_STOP_BOAT]
  ])('when %s, sets correct passBoats state', (_, northSensor, southSensor, expectedState) => {
    simulatorStatus.roadway[boatIdSet[0]] = northSensor;
    simulatorStatus.roadway[boatIdSet[1]] = southSensor;

    updateBridge(simulatorStatus, trafficLightStatus, bridgeState);
    expect(bridgeState.state).toBe(expectedState);
  });

  test('lets bridge traffic pass when BRIDGE_TRAFFIC_GREEN', () => {
    bridgeState.state = PASS_BOAT_STATES.BRIDGE_TRAFFIC_GREEN;
    simulatorStatus.bridge["81"].state = "closed";

    updateBridge(simulatorStatus, trafficLightStatus, bridgeState);

    bridgeIdSet.forEach(id => {
      expect(trafficLightStatus[id]).toBe("groen");
    });
  });

  test('closes bridge when instructed', () => {
    bridgeState.state = PASS_BOAT_STATES.CLOSE_BRIDGE;
    simulatorStatus.bridge["81"].state = "open";

    updateBridge(simulatorStatus, trafficLightStatus, bridgeState);
    expect(trafficLightStatus["81.1"]).toBe("rood");
  });

  test('opens bridge when instructed', () => {
    bridgeState.state = PASS_BOAT_STATES.OPEN_BRIDGE;
    simulatorStatus.bridge["81"].state = "closed";

    updateBridge(simulatorStatus, trafficLightStatus, bridgeState);
    expect(trafficLightStatus["81.1"]).toBe("groen");
    barrierIdSet.forEach(id => {
      expect(trafficLightStatus[id]).toBe("rood");
    });
  });

  test('gives green to barriers before allowing bridge traffic', () => {
    bridgeState.state = PASS_BOAT_STATES.CLOSE_BRIDGE;
    simulatorStatus.bridge["81"].state = "closed";

    updateBridge(simulatorStatus, trafficLightStatus, bridgeState);

    barrierIdSet.forEach(id => {
      expect(trafficLightStatus[id]).toBe("groen");
    });
  });

  test('handles priority vehicle disturbing boat cycle', () => {
    bridgeState.state = PASS_BOAT_STATES.OPEN_BRIDGE;
    simulatorStatus.bridge["81"].state = "open";
    simulatorStatus.priority_vehicle.queue = [{ prioriteit: 1, baan: "8.2" }]; // belongs to trafficGoingTobridgeIdSet

    updateBridge(simulatorStatus, trafficLightStatus, bridgeState);

    expect(bridgeState.state).toBe(PASS_BOAT_STATES.AWAITING_CLOSE_BRIDGE);
  });
});