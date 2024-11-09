import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css"; // Import Swiper styles
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

const Quiz = () => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [swiper, setSwiper] = useState(null);
  const [footballQuizData, setFootballQuizData] = useState([]);

  // Fetch quiz data from the JSON file
  const fetchQuestions = async () => {
    try {
      const response = await fetch("/footballQuizData.json"); // Path to the JSON file in public folder
      const data = await response.json();
      setFootballQuizData(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

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

    // Automatically move to the next question after a delay
    setTimeout(() => {
      if (swiper) {
        swiper.slideNext();
      }
    }, 1500); // Adjust the time as needed
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center mt-10 overflow-y-hidden p-4">
      <div className="fixed top-0 left-0 w-full h-full z-[-2] bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <h1 className="text-4xl font-bold text-white mb-6">Football Quiz</h1>

      {/* Swiper container */}
      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        navigation
        loop
        onSwiper={(swiperInstance) => setSwiper(swiperInstance)} // Set swiper instance
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
                  className={`w-full p-3 text-lg font-medium rounded-md shadow-md ${selectedAnswer === option
                      ? option === quizItem.answer
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                    } transition-all duration-200`}
                >
                  {option}
                </button>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-6 text-white text-lg font-semibold">
        <p>Your Score: {score} / {footballQuizData.length}</p>
      </div>

      {/* ToastContainer to display toasts */}
      <ToastContainer />
    </div>
  );
};

export default Quiz;
