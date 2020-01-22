import React from "react"
import { motion, Variants } from "framer-motion"

const variants: Variants = {
    initial: {
        y: "130%",
    },
    open: {
        y: 0,
    },
}

const AutoUpdater: React.FC = () => {
    const [isOpen, setOpen] = React.useState(false)

    React.useEffect(() => {
        setOpen(true)
    }, [])

    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate={isOpen ? "open" : "initial"}
            className="fixed bg-gray-700 border-gray-300 text-gray-100 shadow p-3 flex flex-col"
            style={{ bottom: 13, left: 13 }}
        >
            <p className="mb-3">Update Downloaded. Restart now?</p>
            <div>
                <button
                    className="btn btn-blue"
                    onClick={e => {
                        setOpen(false)
                    }}
                >
                    Update Now
                </button>
                <button className="btn btn-blue ml-3">Later</button>
            </div>
        </motion.div>
    )
}

export default AutoUpdater
