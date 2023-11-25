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
    to: 4.9,
    result: EResultIndexBody.THIN,
  },
  {
    from: 5,
    to: 13.9,
    result: EResultIndexBody.ATHLETE,
  },
  { from: 14, to: 16.9, result: EResultIndexBody.FITNESS },
  {
    from: 17,
    to: 25.9,
    result: EResultIndexBody.NORMAL,
  },
  { from: 26, to: 100, result: EResultIndexBody.FAT },
];

export const BFPFemale: IBmi[] = [
  {
    from: 0,
    to: 12.9,
    result: EResultIndexBody.THIN,
  },
  {
    from: 13,
    to: 20.9,
    result: EResultIndexBody.ATHLETE,
  },
  { from: 21, to: 24.9, result: EResultIndexBody.FITNESS },
  {
    from: 25,
    to: 31.9,
    result: EResultIndexBody.NORMAL,
  },
  { from: 32, to: 100, result: EResultIndexBody.FAT },
];

export const bfpMale = (height: number, waist: number, neck: number) => {
  return (
    495 /
      (1.0324 -
        0.19077 * Math.log10(waist - neck) +
        0.15456 * Math.log10(height)) -
    450
  );
};
export const bfpFemale = (
  height: number,
  waist: number,
  neck: number,
  hip: number
) => {
  const rs =
    495 /
      (1.29579 -
        0.35004 * Math.log10(waist + hip - neck) +
        0.221 * Math.log10(height)) -
    450;
  return rs;
};

export const bmi = (weight: number, height: number) => {
  height = height / 100;
  return weight / (height * height);
};
