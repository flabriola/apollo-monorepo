import * as Icons from "../../assets/icons";
import { LoadingContainer, IconsContainer } from "./styles";

const iconList = [
    <Icons.AlliumIcon size={16}/>,
    <Icons.CoeliacIcon size={16} />,
    <Icons.DairyFreeIcon size={16} />,
    <Icons.EggIcon size={16} />,
    <Icons.GlutenFreeIcon size={16} />,
    <Icons.LactoseFreeIcon size={16} />,
    <Icons.FishIcon size={16} />,
    <Icons.FructoseFreeIcon size={16} />,
    <Icons.MilkIcon size={16} />,
    <Icons.MustardIcon size={16} />,
    <Icons.NutsIcon size={16} />,
    <Icons.PeanutsIcon size={16} />,
    <Icons.PescatarianIcon size={16} />,
    <Icons.SeafoodIcon size={16} />,
    <Icons.SesameIcon size={16} />,
    <Icons.ShellfishIcon size={16} />,
    <Icons.SoyaIcon size={16} />,
    <Icons.SulphiteIcon size={16} />,
    <Icons.TreeNutsIcon size={16} />,
    <Icons.VeganIcon size={16} />,
    <Icons.VegetarianIcon size={16} />,
    <Icons.WheatIcon size={16} />,
];

function LoadingBar({ style }: { style?: React.CSSProperties }) {

    return (
        <LoadingContainer style={style}>
            <IconsContainer>
                {iconList.concat(iconList).map((Icon, index) => (
                    <div style={{ marginRight: "8px" }} key={index}>{Icon}</div>
                ))}
            </IconsContainer>
        </LoadingContainer>
    );
}


export default LoadingBar;