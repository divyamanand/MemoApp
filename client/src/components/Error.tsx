
const Error = ({errorMessage = "Retry After Some Time", statusCode = 500}) => {
  return (
    <>
    <div>Oops! Something Wrong Happened</div>
    <h2>{statusCode}</h2>
    <div>{errorMessage}</div>
    </>
  )
}

export default Error