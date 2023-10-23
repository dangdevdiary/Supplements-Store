export interface IBmi {
  from: number;
  to: number;
  result: EResultIndexBody;
}

export enum EResultIndexBody {
  THIN = "thin",
  NORMAL = "normal",
  FAT = "fat",
  ATHLETE = "athlete",
  FITNESS = "fitness",
}

export const BMI: IBmi[] = [
  {
    from: 0,
    to: 18.5,
    result: EResultIndexBody.THIN,
  },
  {
    from: 18.6,
    to: 22.9,
    result: EResultIndexBody.NORMAL,
  },
  {
    from: 23,
    to: 100,
    result: EResultIndexBody.FAT,
  },
];

export const BFPMale: IBmi[] = [
  {
    from: 2,
    to: 4,
    result: EResultIndexBody.THIN,
  },
  {
    from: 5,
    to: 13,
    result: EResultIndexBody.ATHLETE,
  },
  { from: 14, to: 17, result: EResultIndexBody.FITNESS },
  {
    from: 17,
    to: 25,
    result: EResultIndexBody.NORMAL,
  },
  { from: 26, to: 100, result: EResultIndexBody.FAT },
];

export const BFPFemale: IBmi[] = [
  {
    from: 0,
    to: 12,
    result: EResultIndexBody.THIN,
  },
  {
    from: 13,
    to: 20,
    result: EResultIndexBody.ATHLETE,
  },
  { from: 21, to: 24, result: EResultIndexBody.FITNESS },
  {
    from: 25,
    to: 31,
    result: EResultIndexBody.NORMAL,
  },
  { from: 32, to: 100, result: EResultIndexBody.FAT },
];

export const bfpMale = (height: number, waist: number, neck: number) => {
  return 86.01 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
};
export const bfpFemale = (
  height: number,
  waist: number,
  neck: number,
  hip: number
) => {
  return (
    163.205 * Math.log10(waist + hip - neck) -
    97.684 * Math.log10(height) -
    78.387
  );
};

export const bmi = (weight: number, height: number) => {
  height = height / 100;
  return weight / (height * height);
};
