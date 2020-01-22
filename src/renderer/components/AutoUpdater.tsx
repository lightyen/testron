import React from "react"
import { motion, Variants } from "framer-motion"
import { useSelector, useAction } from "~/store"

const variants: Variants = {
    initial: {
        y: "130%",
    },
    open: {
        y: 0,
    },
}

const AutoUpdater: React.FC = () => {
    const available = useSelector(state => state.app.update_available)
    const downloaded = useSelector(state => state.app.update_downloaded)
    const progress = useSelector(state => state.app.update_progress)
    const version = useSelector(state => state.app.update_version)
    const { updateDownload, updateRestart } = useAction().app
    const [isOpen, setOpen] = React.useState(false)
    React.useEffect(() => {
        available && setOpen(true)
    }, [available])

    function text() {
        if (downloaded) {
            return "Restart Now?"
        }
        if (progress > 0) {
            return "Downloading..."
        }
        if (available) {
            return "Download"
        }
        return ""
    }

    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate={isOpen ? "open" : "initial"}
            className="fixed bg-gray-700 border-gray-300 text-gray-100 shadow p-3 flex flex-col"
            style={{ bottom: 13, left: 13 }}
        >
            <p className="mb-3">Update Available {version}</p>
            <div>
                <button
                    className="btn btn-blue"
                    onClick={() => {
                        if (downloaded) {
                            updateRestart()
                            return
                        }
                        if (available) {
                            updateDownload()
                        }
                    }}
                >
                    {text()}
                </button>
                <button className="btn btn-blue ml-3" onClick={() => setOpen(false)}>
                    Later
                </button>
            </div>
        </motion.div>
    )
}

export default AutoUpdater
