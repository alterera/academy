import Image from "next/image";
import React from "react";

const faqData = [
  {
    id: 1,
    title: "What is Wati Academy?",
    answer:
      "Alterera Academy is a learning platform created by Alterera Networks to help students and professionals gain real-world, industry-relevant skills through structured online courses. Our courses are designed by industry practitioners who have experience building actual products and solving real challenges, ensuring you get insight that goes beyond theory.",
  },
  {
    id: 2,
    title: "Are the courses beginner friendly?",
    answer:
      "Yes! All courses are designed with a progressive learning path, starting from basics and moving into advanced concepts with clarity. Whether you're a complete beginner or someone looking to refresh your foundation, the learning path is made to be smooth and stress-free.",
  },
  {
    id: 3,
    title: "Do I get lifetime access to the courses?",
    answer:
      "Absolutely. Once you enroll, you get lifetime access to all lessons, updates, and downloadable resources. You can revisit lessons anytime, learn at your own pace, and even come back months later when you need a refresher. There's no expiry, no deadlines, and no pressure.",
  },
];

const FAQs = () => {
  return (
    <div className="w-full py-10 md:py-15 px-4 md:px-0">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold md:px-0">
          Frequently Asked Questions.
        </h2>

        <div className="mt-6 md:mt-8 lg:mt-10">
          {faqData.map((item) => (
            <div className="pb-4 md:pb-6 border-b-2 border-black mt-6 md:mt-8 lg:mt-10 last:border-b-0" key={item.id}>
              <h4 className="flex items-center text-lg md:text-xl lg:text-2xl font-bold gap-2 md:gap-3">
                <div className="relative w-5 h-5 md:w-6 md:h-6 shrink-0">
                  <Image
                    src={"/icons/question.png"}
                    fill
                    alt="question mark"
                    className="object-contain"
                  />
                </div>
                <span>{item.title}</span>
              </h4>
              <p className="mt-2 md:mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs;
