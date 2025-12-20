import { Link } from "react-router-dom";

type CardProps = {
	name: string;
	Icon: React.FC<React.SVGProps<SVGSVGElement>>;
	link: string;
	newtab?: boolean;
	className?: string;
	description?: string;
};

const Card = ({
	name,
	Icon,
	link,
	newtab,
	className,
	description,
}: CardProps) => {
	return (
		<Link
			to={link}
			className={`card ${className ? className : ""}`}
			target={newtab ? "_blank" : ""}
		>
			<Icon />
			<div>
				<h3>{name}</h3>
				{description && <p>{description}</p>}
			</div>
		</Link>
	);
};

export default Card;
