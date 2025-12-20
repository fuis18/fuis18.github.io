import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

type ProjectProps = {
	id: number;
	title: string;
};

const ProjectInput = ({ id, title }: ProjectProps) => {
	const [src, setSrc] = useState(`/img/${id}.svg`);
	const [name, setName] = useState("form__div__img-ok");

	return (
		<Button variant="ghost" asChild>
			<Link to={`/pages/${id}`} className="form__div">
				<img
					src={src}
					width={100}
					height={100}
					alt={title}
					className={name}
					onError={() => {
						setName("");
						setSrc("/img/err.png");
					}}
				/>
				{title}
			</Link>
		</Button>
	);
};

export default ProjectInput;
