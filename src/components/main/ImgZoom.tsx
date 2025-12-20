type ImgZoomProps = {
	src: string;
};

const ImgZoom = ({ src }: ImgZoomProps) => {
	return <img src={src} alt="Zoomed image" />;
};

export default ImgZoom;
