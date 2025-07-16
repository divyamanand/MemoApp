

const RevisionCard = ({revision}) => {
    const {questionName, difficulty, tags, nextRevisionId} = revision
  return (
    <>
        <h3>{questionName}</h3>
        <a>{difficulty}</a>
        {/* <p>description</p> */}
        {/* <div> Option 1</div> */}
        {/* <div>Option 2</div> */}
        {/* <div></div> */}
        <button>Information</button>
        <input type="checkbox" name="done"/>
    </>
  )
}

export default RevisionCard