import React from "react"
import { motion, Variants } from "framer-motion"
import { useSelector } from "~/store"

const variants: Variants = {
    initial: {
        y: "130%",
    },
    open: {
        y: 0,
    },
}

const AutoUpdater: React.FC = () => {
    const { available } = useSelector(state => state.app.update)
    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate={available ? "open" : "initial"}
            className="fixed bg-gray-700 border-gray-300 text-gray-100 shadow p-3 flex flex-col"
            style={{ bottom: 13, left: 13 }}
        >
            <p className="mb-3">Update Downloaded. Restart now?</p>
            <div>
                <button className="btn btn-blue">Update Now</button>
                <button className="btn btn-blue ml-3">Later</button>
            </div>
        </motion.div>
    )
}

export default AutoUpdater
