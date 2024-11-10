import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrophy } from "react-icons/fa"; // Correct import for FaTrophy

const Quiz = () => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [swiper, setSwiper] = useState(null);
  const [footballQuizData, setFootballQuizData] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/footballQuizData.json");
      const data = await response.json();
      setFootballQuizData(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Track score change and check if game is won
  useEffect(() => {
    if (score === 10) {
      setGameOver(true);
      toast.success("YOU WON!!! 🎉🎉", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  }, [score]); // Runs every time score changes

  const handleAnswer = (questionIndex, answer, correctAnswer) => {
    if (answer === correctAnswer) {
      setScore((prevScore) => prevScore + 1);
      toast.success("Correct Answer!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
      });
    } else {
      toast.error("Wrong Answer!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
      });
    }

    setSelectedAnswer(answer);

    setTimeout(() => {
      if (swiper) {
        swiper.slideNext();
      }
    }, 1500);
  };

  return (
    <div className=" absolute inset-0 -z-20 w-full min-h-screen bg-transparent bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] flex flex-col items-center p-4 justify-center">
      <h1 className="text-4xl font-bold text-white mb-6">Football Quiz</h1>

      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        navigation
        loop
        onSwiper={(swiperInstance) => setSwiper(swiperInstance)}
        className="w-full max-w-xl"
      >
        {footballQuizData.map((quizItem, index) => (
          <SwiperSlide key={index} className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{quizItem.question}</h2>
            <div className="space-y-4">
              {quizItem.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(index, option, quizItem.answer)}
                  className={`w-full p-3 text-lg font-medium rounded-md shadow-md ${
                    selectedAnswer === option
                      ? option === quizItem.answer
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  } transition-all duration-200`}
                  disabled={gameOver} // Disable button if game is over
                >
                  {option}
                </button>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-6 text-white text-lg font-semibold">
        <p>Your Score: {score} / 10</p>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Quiz;
