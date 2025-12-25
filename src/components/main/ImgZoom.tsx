import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ImgZoomProps = {
	src: string;
	alt?: string;
};

const ImgZoom = ({ src, alt = "Zoom image" }: ImgZoomProps) => {
	const [isZoomed, setIsZoomed] = useState(false);

	return (
		<>
			{/* Imagen normal */}
			<motion.img
				src={src}
				alt={alt}
				className="zoom-normal"
				layoutId={`zoom-${src}`}
				onClick={() => setIsZoomed(true)}
			/>

			{/* Modal */}
			<AnimatePresence>
				{isZoomed && (
					<motion.div
						className="zoom-overlay"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setIsZoomed(false)}
					>
						<motion.img
							src={src}
							alt={alt}
							className="zoom-modal-img"
							layoutId={`zoom-${src}`}
							onClick={(e) => e.stopPropagation()}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default ImgZoom;
