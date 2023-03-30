import { motion } from "framer-motion";

export const Header = () => {
    return (
        <div className="h-16 flex p-4 bg-black items-center">
            <div className="text-primary">
                <span>fme&gt;</span>
                <motion.span
                    className="text-2xl"
                    animate={{ opacity: [1, 0.5, 0, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    &#9646;
                </motion.span>
            </div>
        </div>
    );
};
