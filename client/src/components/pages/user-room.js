import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AnswerField from "../others/answerField";
import { Table } from "react-bootstrap";
import QuestionField from "../others/questionField";

const UserRoom = () => {
  const roomId = useParams();
  const [qnaList, setQnaList] = useState([]);
  const [filterby, setFilterby] = useState("all");
  const [upvote, setUpvote] = useState(false);
  console.log(qnaList);

  useEffect(() => {
    axios
      .get(`/qna/${roomId.roomid}`, { withCredentials: true })
      .then((response) => {
        // console.log(response.data);
        setQnaList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // const handleAnswerBtn = (qnaArr) => {
  //   // console.log("Clicked");
  //   setQnaList((state) => {
  //     const filter = state.filter((x) => x._id !== qnaArr._id);
  //     const toUpdateAnswer = state.find((list) => list._id === qnaArr._id);
  //     console.log(toUpdateAnswer);

  //     return [
  //       ...filter,
  //       { ...toUpdateAnswer, answer: "Answered during presentation" },
  //     ];
  //   });
  // };

  // const handleStateUpdate = (updatedAns, qnaid) => {
  //   // console.log("UpdatedAns: " + updatedAns);
  //   // console.log("ID: " + qnaid);
  //   setQnaList((state) => {
  //     const filter = state.filter((x) => x._id !== qnaid);
  //     const toUpdateAnswer = state.find((list) => list._id === qnaid);
  //     // console.log(toUpdateAnswer);
  //     return [...filter, { ...toUpdateAnswer, answer: updatedAns }];
  //   });
  // };

  const countUnanswered = () => {
    let count = 0;
    for (let i = 0; i < qnaList.length; i++) {
      if (qnaList[i].answer === "") {
        count += 1;
      }
    }
    return count;
  };

  const countAnswered = () => {
    let count = 0;
    for (let i = 0; i < qnaList.length; i++) {
      if (qnaList[i].answer !== "") {
        count += 1;
      }
    }
    return count;
  };

  const displayAllqna = qnaList
    .filter((x) => {
      if (filterby === "answered") {
        return x.answer !== "";
      } else if (filterby === "unanswered") {
        return x.answer === "";
      } else {
        return x;
      }
    })
    .sort((a, b) => b.upvote - a.upvote)
    .map((qnaList, index) => {
      return (
        <tr key={qnaList._id}>
          <td>{index + 1}</td>
          <td>{qnaList.upvote}</td>
          <td>{qnaList.question}</td>
          <td>{qnaList.answer}</td>
        </tr>
      );
    });

  const handleFilter = (event) => {
    console.log(event.target.value);
    setFilterby(event.target.value);
  };

  return (
    <>
      <h1>User QnA Page</h1>
      <p>Display all QnA from database</p>
      <br />
      <QuestionField roomId={roomId} />
      <br />
      <br />
      <label>Filter by: </label>
      <select
        onChange={(event) => {
          handleFilter(event);
        }}
      >
        <option value="all">All ({qnaList.length})</option>
        <option value="unanswered">Unanswered ({countUnanswered()})</option>
        <option value="answered">Answered ({countAnswered()})</option>
      </select>
      <br />
      <br />
      <Table striped bordered hover>
        <thead>
          <tr>
            <td>S/N</td>
            <td>Upvote</td>
            <td>Question</td>
            <td>Answer</td>
          </tr>
        </thead>
        <tbody>{displayAllqna}</tbody>
      </Table>
    </>
  );
};

export default UserRoom;
