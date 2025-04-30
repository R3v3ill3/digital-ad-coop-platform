import React, { useEffect, useRef, useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function OnboardingChat() {
  const [messages, setMessages] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [otherInput, setOtherInput] = useState('');
  const [multiSelect, setMultiSelect] = useState([]);
  const [awaitingOtherInput, setAwaitingOtherInput] = useState(false);
  const scrollRef = useRef(null);
  const auth = getAuth();
  const navigate = useNavigate();

  const steps = [
    {
      key: 'org_type',
      question: 'What type of organisation are you?',
      required: true,
      options: ['Union', 'NGO', 'Political Party', 'Community Group', 'Social Enterprise', 'Other'],
    },
    {
      key: 'scale',
      question: 'What is your operational scale?',
      required: true,
      options: ['Local', 'Statewide', 'National', 'International', 'Federation with Local Branches', 'Other'],
    },
    {
      key: 'membership_size',
      question: 'How many members/supporters do you have?',
      required: false,
      options: ['<100', '100–1000', '1000–5000', '5000–10,000', '10,000+'],
    },
    {
      key: 'campaign_budget',
      question: 'Typical campaign budget range?',
      required: false,
      options: ['Under $5,000', '$5,000–$20,000', '$20,000–$100,000', 'Over $100,000'],
    },
    {
      key: 'staff_count',
      question: 'How many paid staff?',
      required: false,
      options: ['0', '1–5', '6–20', '21–100', '100+'],
    },
    {
      key: 'volunteer_count',
      question: 'How many active volunteers?',
      required: false,
      options: ['0', '1–10', '11–50', '51–200', '200+'],
    },
    {
      key: 'tech_stack',
      question: 'Which campaign tools do you use? (Select all that apply, then press Submit)',
      required: false,
      multi: true,
      options: [
        'Action Network',
        'Yabbr',
        'NationBuilder',
        'Mailchimp',
        'Hootsuite',
        'Canva',
        'HubSpot',
        'Zoho Campaigns',
        'Other',
      ],
    },
  ];

  useEffect(() => {
    if (stepIndex === 0) {
      setMessages([
        { sender: 'bot', text: '👋 Welcome! Let’s get to know your organisation so we can tailor the platform to your needs.' },
        { sender: 'bot', text: steps[0].question }
      ]);
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelect = (option) => {
    const step = steps[stepIndex];
    const key = step.key;

    if (step.multi) {
      setMultiSelect((prev) =>
        prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
      );
      return;
    }

    const updatedAnswers = { ...answers, [key]: option };
    setAnswers(updatedAnswers);
    setMessages((prev) => [...prev, { sender: 'user', text: option }]);

    if (option === 'Other') {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Please specify:' }]);
        setAwaitingOtherInput(true);
      }, 500);
      return;
    }

    advanceStep(updatedAnswers);
  };

  const handleMultiSubmit = () => {
    const step = steps[stepIndex];
    if (multiSelect.includes('Other')) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Please specify what "Other" refers to:' }]);
      setAwaitingOtherInput(true);
      return;
    }

    const updatedAnswers = { ...answers, [step.key]: multiSelect };
    setAnswers(updatedAnswers);
    setMessages((prev) => [...prev, { sender: 'user', text: multiSelect.join(', ') }]);
    setMultiSelect([]);
    advanceStep(updatedAnswers);
  };

  const handleOtherSubmit = () => {
    const step = steps[stepIndex];
    const updatedAnswers = { ...answers };

    if (step.key === 'tech_stack') {
      const stack = multiSelect.filter(tool => tool !== 'Other');
      stack.push(otherInput.trim());
      updatedAnswers[step.key] = stack;
      setMessages(prev => [...prev, { sender: 'user', text: otherInput.trim() }]);
      setMultiSelect([]);
    } else {
      updatedAnswers[step.key] = otherInput;
      setMessages(prev => [...prev, { sender: 'user', text: otherInput }]);
    }

    setAnswers(updatedAnswers);
    setOtherInput('');
    setAwaitingOtherInput(false);
    advanceStep(updatedAnswers);
  };

  const advanceStep = async (updatedAnswers) => {
    const nextStepIndex = stepIndex + 1;

    if (nextStepIndex < steps.length) {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: steps[nextStepIndex].question }]);
        setStepIndex(nextStepIndex);
      }, 500);
    } else {
      setTimeout(async () => {
        setMessages(prev => [...prev, { sender: 'bot', text: '✅ Thanks! You’ve completed the onboarding.' }]);
        setStepIndex(nextStepIndex);
        try {
          const user = auth.currentUser;
          if (user) {
            await setDoc(doc(db, 'organisations', user.uid), {
              ...updatedAnswers,
              completedAt: new Date(),
            });
            navigate('/dashboard');
          } else {
            setMessages(prev => [...prev, { sender: 'bot', text: '⚠️ User not authenticated — unable to save.' }]);
          }
        } catch (err) {
          console.error('Error saving onboarding data:', err);
          setMessages(prev => [...prev, { sender: 'bot', text: '⚠️ Something went wrong while saving.' }]);
        }
      }, 500);
    }
  };

  const currentStep = stepIndex < steps.length ? steps[stepIndex] : null;

  return (
    <div className="p-4 flex flex-col h-full max-w-3xl mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Organisational Onboarding</h2>
        <p className="text-gray-700">Answer a few questions to help us tailor your campaign tools.</p>
      </div>

      <div className="flex-1 overflow-auto space-y-2 mb-4 max-h-[60vh] border rounded p-4 bg-white shadow-sm">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded max-w-[80%] ${
              m.sender === 'user' ? 'bg-blue-100 self-end text-right' : 'bg-gray-100 self-start'
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {currentStep && currentStep.options && !currentStep.multi && !awaitingOtherInput && (
        <div className="flex flex-col gap-2">
          {currentStep.options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className="w-full px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded text-left"
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {currentStep && currentStep.multi && !awaitingOtherInput && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {currentStep.options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`px-3 py-2 rounded ${
                  multiSelect.includes(option)
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 hover:bg-blue-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={handleMultiSubmit}
            className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            disabled={multiSelect.length === 0}
          >
            Submit
          </button>
        </div>
      )}

      {awaitingOtherInput && (
        <div className="flex space-x-2 mt-2">
          <input
            value={otherInput}
            onChange={(e) => setOtherInput(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Type your answer"
          />
          <button
            onClick={handleOtherSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={!otherInput.trim()}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
