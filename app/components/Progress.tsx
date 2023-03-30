import { motion } from 'framer-motion';

export const Progress = ({ percentage } : { percentage: number }) => {
    return (
        <div className="text-primary">
            <div className='flex gap-4 items-center'>
                <motion.div
                    className="w-[100px] h-2 bg-primary inline-block"
                    initial={{ width: '0%' }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                />
                <span>{`${percentage}%`}</span>
            </div>
        </div>
    )
};
