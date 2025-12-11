import React, { useState } from 'react';
import './Quiz.css';
import { data as Data } from './Data.jsx';

const Quiz = () => {
    const [index, setIndex] = useState(0);
    const [question, setQuestion] = useState(Data[0]);

    const handleNext = () => {
        if (index < Data.length - 1) {
            const nextIndex = index + 1;
            setIndex(nextIndex);
            setQuestion(Data[nextIndex]);
        }
    };

    return (
        <div className='container'>
            <h1>Quiz App</h1>
            <hr />
            <h2>{index + 1}. {question.question}</h2> {/* Changed to lowercase */}
            <ul>
                <li>{question.option1}</li>
                <li>{question.option2}</li>
                <li>{question.option3}</li>
                <li>{question.option4}</li>
            </ul>
            <button onClick={handleNext}>Next</button>
            <div className="index">
                {index + 1} of {Data.length} Questions
            </div>
        </div>
    );
};

export default Quiz;