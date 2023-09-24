export const success = () => {
  return { message: "success" };
};

export const failed = () => {
  return { message: "failed" };
};

export function Ok<T>(data: T) {
  return {
    status: "success",
    data,
  };
}
