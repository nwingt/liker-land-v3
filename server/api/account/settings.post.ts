export default defineEventHandler(async (/* event */) => {
  // const session = await requireUserSession(event)
  // const body = await readBody(event)
  // await setUserSession(event, {
  //   user: {
  //     ...session.user,
  //   },
  // })
  throw createError({
    statusCode: 501,
    message: 'NOT_IMPLEMENTED',
  })
})
