import { Preferences } from "../shared/restaurant/types";
import { EggIcon, MilkIcon, SoyaIcon, WheatIcon, TreeNutsIcon, PeanutsIcon, NutsIcon, ShellfishIcon, FishIcon, SeafoodIcon, SesameIcon, CoeliacIcon, SulphiteIcon, MustardIcon, AlliumIcon, VegetarianIcon, VeganIcon, PescatarianIcon, GlutenFreeIcon, LactoseFreeIcon, DairyFreeIcon, FructoseFreeIcon } from "../assets/icons";
import type { JSX } from "react";

export const getPreferenceIcon = (preference: Preferences, size: number = 20, fill: string = "var(--color-black)"): JSX.Element => {
    switch (preference) {
        case Preferences.EGG:
            return <EggIcon size={size} fill={fill} />;
        case Preferences.MILK:
            return <MilkIcon size={size} fill={fill} />;
        case Preferences.SOYA:
            return <SoyaIcon size={size} fill={fill} />;
        case Preferences.WHEAT:
            return <WheatIcon size={size} fill={fill} />;
        case Preferences.TREE_NUTS:
            return <TreeNutsIcon size={size} fill={fill} />;
        case Preferences.PEANUTS:
            return <PeanutsIcon size={size} fill={fill} />;
        case Preferences.NUTS:
            return <NutsIcon size={size} fill={fill} />;
        case Preferences.SHELLFISH:
            return <ShellfishIcon size={size} fill={fill} />;
        case Preferences.FISH:
            return <FishIcon size={size} fill={fill} />;
        case Preferences.SEAFOOD:
            return <SeafoodIcon size={size} fill={fill} />;
        case Preferences.SESAME:
            return <SesameIcon size={size} fill={fill} />;
        case Preferences.COELIAC:
            return <CoeliacIcon size={size} fill={fill} />;
        case Preferences.SULPHITE:
            return <SulphiteIcon size={size} fill={fill}/>;
        case Preferences.MUSTARD:
            return <MustardIcon size={size} fill={fill} />;
        case Preferences.ALLIUM:
            return <AlliumIcon size={size} fill={fill} />;
        case Preferences.VEGETARIAN:
            return <VegetarianIcon size={size} fill={fill} />;
        case Preferences.VEGAN:
            return <VeganIcon size={size} fill={fill} />;
        case Preferences.PESCATARIAN:
            return <PescatarianIcon size={size} fill={fill} />;
        case Preferences.GLUTEN_FREE:
            return <GlutenFreeIcon size={size} fill={fill} />;
        case Preferences.LACTOSE_FREE:
            return <LactoseFreeIcon size={size} fill={fill} />;
        case Preferences.DAIRY_FREE:
            return <DairyFreeIcon size={size} fill={fill} />;
        case Preferences.FRUCTOSE_FREE:
            return <FructoseFreeIcon size={size} fill={fill} />;
        default:
            return <span />;
    }
}