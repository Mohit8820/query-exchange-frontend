import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import { AuthContext } from "../../contexts/auth-context";
import { useHttpClient } from "../../hooks/http-hook";
import Modal from "../UIElements/Modal";
import ErrorModal from "../../components/UIElements/ErrorModal";
import LoadingSpinner from "../../components/UIElements/LoadingSpinner";
import Editor from "./QuillEditor/Editor";
import "./Questionbar.css";

const Questionsbar = (props) => {
  var question = props.question;
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [answers, setAnswers] = useState(question.answers);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const getAnswer = async () => {
    try {
      const responseData = await sendRequest(
        `http://localhost:4000/api/questions/${question.id}`
      );

      setAnswers(responseData.question.answers);
      console.log(answers);
    } catch (err) {}
  };

  const [deleteQues, setDeleteQues] = useState(false);

  const deleteQuestion = async () => {
    setDeleteQues(false);
    try {
      await sendRequest(
        `http://localhost:4000/api/questions/${question.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      navigate("/home");
    } catch (err) {}
  };
  const [answerId, setAnswerId] = useState("");
  const [deleteAns, setDeleteAns] = useState(false);

  const deleteAnswer = async () => {
    setDeleteAns(false);
    try {
      await sendRequest(
        `http://localhost:4000/api/questions/delete?question_id=${question.id}&answer_id=${answerId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      getAnswer();
    } catch (err) {}
  };

  /* function addAns(value) {
    setAnswers((prevAnswers) => {
      return [...prevAnswers, value];
    });
  }*/
  //
  return (
    <React.Fragment>
      <Modal
        onCancel={() => setDeleteQues(false)}
        show={deleteQues}
        header="delete request"
        footer={
          <div>
            <button onClick={() => setDeleteQues(false)}>Cancel</button>
            <button onClick={deleteQuestion}>Okay</button>
          </div>
        }
      >
        Do you want to delete the question
      </Modal>
      <Modal
        onCancel={() => setDeleteAns(false)}
        show={deleteAns}
        header="delete request"
        footer={
          <div>
            <button onClick={() => setDeleteAns(false)}>Cancel</button>
            <button onClick={deleteAnswer}>Okay</button>
          </div>
        }
      >
        Do you want to delete the answer
      </Modal>

      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      <div className="question-bar">
        <div className="display-ques">
          <h3>{question.questionTitle}</h3>
          <p>{question.questionBody}</p>
          <div className="display-tags-time">
            <div className="display-tags">
              <p>{question.questionTags}</p>
            </div>
            <p className="display-time">
              asked {moment(question.askedOn).fromNow()}
            </p>
          </div>
          {auth.userId === question.userId && (
            <button onClick={() => setDeleteQues(true)}>delete</button>
          )}
        </div>

        {/* <div>
        <p>{question.upVotes - question.downVotes}</p>
        <p>votes</p>
      </div>
      <div className="display-votes-ans">
        <p>{question.noOfAnswers}</p>
        <p>answers</p> 
      </div>*/}

        <div className="answers">
          <h3>Answers</h3>
          <hr></hr>
          {answers.map((answer, index) => {
            return (
              <React.Fragment key={index}>
                <span>{answer.id}</span>
                <span>{answer.userAnswered}</span>
                {auth.userId === answer.userId && (
                  <button
                    onClick={() => {
                      setAnswerId(answer.id);
                      setDeleteAns(true);
                    }}
                  >
                    delete
                  </button>
                )}
                <div dangerouslySetInnerHTML={{ __html: answer.answerBody }} />
                <hr></hr>
              </React.Fragment>
            );
          })}
        </div>

        <Editor add={getAnswer} qid={question._id} />
      </div>
    </React.Fragment>
  );
};

export default Questionsbar;
