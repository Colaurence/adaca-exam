export const userTransformer = async (data) => {
  const { password, ...users } = await data;

  return {
    ...users,
  };
};
