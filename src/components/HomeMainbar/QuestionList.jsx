import React from "react";
import Questions from "./Questions";
const QuestionList = ({ questionsList, filterval }) => {
  if (filterval == "all") {
    return (
      <>
        <p>{questionsList.length} questions</p>
        {questionsList
          .slice(0)
          .reverse()
          .map((question) => (
            <Questions question={question} key={question._id} />
          ))}
      </>
    );
  } else {
    var output = questionsList.filter(
      (question) => question.questionTags == filterval
    );
    console.log(output);
    return (
      <>
        <p>{output.length} questions</p>
        {output
          .slice(0)
          .reverse()
          .map((out) => (
            <Questions question={out} key={out._id} />
          ))}
      </>
    );
  }
};

export default QuestionList;
