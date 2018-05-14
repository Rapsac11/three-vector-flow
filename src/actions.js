export const SAMPLE_ACTION = 'SAMPLE_ACTION'
export const SAMPLE_THUNKED_ACTION = 'SAMPLE_THUNKED_ACTION'

export const sampleAction = item => ({
  type: sampleAction,
  payload: item
})

export const sampleThunkedAction = (item) => dispatch => {
    dispatch({
      type: sampleThunkedAction,
      payload: item
    })
}
