import React from 'react';

const QuestionCard = ({ question }) => {
  const { questionName, tags, upcomingRevisions = [] } = question;

  return (
    <>
      <h3>{questionName}</h3>
      <ol>
        {upcomingRevisions.map((rev, idx) => (
          <li key={idx}>{rev.date}</li>
        ))}
      </ol>
    </>
  );
};

export default QuestionCard;
