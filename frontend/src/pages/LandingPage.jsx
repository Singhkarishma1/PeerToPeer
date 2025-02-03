import React from 'react';
import { motion } from 'framer-motion';
import FeatureCard from './FeatureCard';

const LandingPage = () => {
    return (
        <div className="bg-gray-100">
            {/* Hero Section */}
            <motion.section
                className="bg-blue-500 py-32 " // Increased padding and added min-h-screen
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="container mx-auto px-4 text-center">
                    {/* Floating animation for the headline */}
                    <motion.h2
                        className="text-4xl font-bold text-white mb-4"
                        animate={{
                            y: [0, -10, 0, 10, 0], // Keyframes for vertical floating motion
                        }}
                        transition={{
                            duration: 4, // Duration of the entire animation cycle
                            repeat: Infinity, // Repeat infinitely
                            ease: "easeInOut", // Smooth easing
                        }}
                    >
                        Connect, Learn, and Grow
                    </motion.h2>
                    <p className="text-lg text-white mb-8">
                        A platform designed to bring learners together to share knowledge and skills.
                    </p>
                    <motion.button
                        className="bg-white text-blue-500 font-bold py-3 px-6 rounded-full hover:bg-blue-100"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Get Started
                    </motion.button>
                </div>
            </motion.section>

            {/* Features Section */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div>
                        <FeatureCard
                            title="Skill Matching"
                            description="Find peers with complementary skills and learning needs. Whether you want to master a new subject or refine an existing skill, our intelligent system pairs you with the perfect learning partner. Imagine having someone who not only shares your curiosity but also inspires you to grow and achieve your goals. With personalized matches, you’ll connect with individuals who make learning engaging, supportive, and fun."
                            imageSrc="https://th.bing.com/th/id/OIP.BNNj29xFBg-yRNSze7FwxAHaEa?rs=1&pid=ImgDetMain"
                            isLeftAligned={true}
                        />
                        <FeatureCard
                            title="Virtual Workspaces"
                            description="Collaborate in real-time with seamless virtual workspaces designed to bring your ideas to life. Share resources, brainstorm concepts, and provide feedback effortlessly—all from the comfort of your own space. Whether you’re solving a complex problem or creating something new, our virtual workspaces make teamwork intuitive and efficient. With tools that keep everyone on the same page, you can focus on what truly matters: learning, growing, and achieving together."
                            imageSrc="https://cdn.autonomous.ai/static/upload/images/common/upload/20210909/3-Virtual-Workspace-Software-to-Work-Digitally-With-Your-Team_21f49ba1d4d.jpg"
                            isLeftAligned={false}
                        />
                        <FeatureCard
                            title="Progress Tracking"
                            description="Stay motivated and on track with our intuitive progress tracking system. Celebrate your learning milestones, big or small, and see your growth unfold with every step. Visualize your achievements and pinpoint areas for improvement, so you’re always moving forward with confidence. Whether you're mastering a new skill or refining your expertise, our progress tracker is your companion in turning goals into accomplishments."
                            imageSrc="https://static.vecteezy.com/system/resources/previews/013/055/209/original/project-tracking-goal-tracker-task-completion-or-checklist-to-remind-project-progress-concept-businessman-project-manager-holding-big-pencil-to-check-completed-tasks-in-project-management-timeline-free-vector.jpg"
                            isLeftAligned={true}
                        />
                    </div>
                </div>
            </section>

            {/* Footer Section */}
        </div>
    );
};

export default LandingPage;
