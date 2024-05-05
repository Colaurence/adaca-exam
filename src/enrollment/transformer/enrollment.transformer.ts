export const enrollmentTransformer = async (data) => {
  const { Enrollment,password, ...user } = await data;

  return {
    ...user,
    Enrollment: Enrollment?.map((enrollment) => ({
      ...enrollment,
    })),
  };
};
