enum SysModuleEnum {
  MULTIPLE = "MULTIPLE",
  REGULATION = "REGULATION",
  WHEEL_1 = "WHEEL1",
  WHEEL_2 = "WHEEL2",
}

enum SysItemEnum {
  MISSION_1_RULES = "mission_1_rules",
  MISSION_2_RULES = "mission_2_rules",

}

interface ValueRate {
  value: any;
  rate: number;
}

function getCalculateRate(list: ValueRate[]): any {
  if (!list || list.length === 0) return 0;
  let randomNumber = Math.random();

  for (let i = 0; i < list.length; i++) {
    if (randomNumber < list[i].rate) {
      return list[i].value;
    } else {
      randomNumber -= list[i].rate;
    }
  }

  return list[list.length - 1].value;
}

export enum StatusSend {
  INIT = "INIT",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}

export enum StatusMaintenance {
  YES = "YES",
  NO = "NO",
}

export {
  SysItemEnum as SYS_ITEM_ENUM,
  SysModuleEnum as SYS_MODULE_ENUM,
  ValueRate,
  getCalculateRate
};
