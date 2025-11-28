import React from "react";

const reviewData = [
  {
    id: 1,
    title: "“The best learning experience I ever had”",
    review: "The lessons are clear, practical, and easy to follow. I was able to build real projects within weeks, and the mentorship support made everything even smoother.",
    name: "Sushant Koirala",
    position: "Software Engineering Student, Kathmandu",
  },
  {
    id: 2,
    title: "“Perfect for beginners and working professionals”",
    review: "I joined to upskill for my job, and the structured modules helped me learn without feeling overwhelmed. The resources and lifetime access are a huge plus!",
    name: "Anisha Gurung",
    position: "Marketing Executive, Pokhara",
  },
  {
    id: 3,
    title: "“Super practical and industry-relevant”",
    review: "Every concept is explained with real-world examples, and the projects helped me strengthen my portfolio. I feel much more confident applying for tech roles now.",
    name: "Arjun Patel",
    position: "Frontend Developer, Mumbai",
  },
];

const Testimonials = () => {
  return (
    <div className="w-full bg-[#fee96e] py-10 md:py-20 px-4 md:px-0">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-4 px-4">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center">
            Over 10,000 students
          </h2>
          <p className="text-center text-base md:text-lg nunito text-[#1d1d1d]">
            What some of our 10,000+ customers across 160+ countries think of
            Alterera.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-5 mt-8 md:mt-5">
          {reviewData.map((item) => (
            <div 
              className="bg-white p-6 md:p-8 rounded-2xl flex flex-col justify-between gap-4 flex-1" 
              key={item.id}
            >
              <h4 className="font-bold pb-2 text-lg md:text-xl">{item.title}</h4>
              <p className="text-sm md:text-base flex-1">{item.review}</p>
              <div>
                <h4 className="font-medium text-base md:text-lg">{item.name}</h4>
                <span className="text-sm md:text-base text-muted-foreground">{item.position}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
