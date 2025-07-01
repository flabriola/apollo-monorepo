import { Preferences } from "../shared/restaurant/types";
import { useTranslation } from "react-i18next";

const { t } = useTranslation();

export const getPreferencesNames = (): { [key in Preferences]: string } => ({
    [Preferences.EGG]: t("preferences.egg"),
    [Preferences.MILK]: t("preferences.milk"),
    [Preferences.SOYA]: t("preferences.soya"),
    [Preferences.WHEAT]: t("preferences.wheat"),
    [Preferences.TREE_NUTS]: t("preferences.treeNuts"),
    [Preferences.PEANUTS]: t("preferences.peanuts"),
    [Preferences.NUTS]: t("preferences.nuts"),
    [Preferences.SHELLFISH]: t("preferences.shellfish"),
    [Preferences.FISH]: t("preferences.fish"),
    [Preferences.SEAFOOD]: t("preferences.seafood"),
    [Preferences.SESAME]: t("preferences.sesame"),
    [Preferences.COELIAC]: t("preferences.coeliac"),
    [Preferences.SULPHITE]: t("preferences.sulphite"),
    [Preferences.MUSTARD]: t("preferences.mustard"),
    [Preferences.ALLIUM]: t("preferences.allium"),
    [Preferences.VEGETARIAN]: t("preferences.vegetarian"),
    [Preferences.VEGAN]: t("preferences.vegan"),
    [Preferences.PESCATARIAN]: t("preferences.pescatarian"),
    [Preferences.GLUTEN_FREE]: t("preferences.glutenFree"),
    [Preferences.LACTOSE_FREE]: t("preferences.lactoseFree"),
    [Preferences.DAIRY_FREE]: t("preferences.dairyFree"),
    [Preferences.FRUCTOSE_FREE]: t("preferences.fructoseFree")
});

export const getPreferencesDescriptions = (): { [key in Preferences]: string } => ({
    [Preferences.EGG]: t("preferences.description.egg"),
    [Preferences.MILK]: t("preferences.description.milk"),
    [Preferences.SOYA]: t("preferences.description.soya"),
    [Preferences.WHEAT]: t("preferences.description.wheat"),
    [Preferences.TREE_NUTS]: t("preferences.description.treeNuts"),
    [Preferences.PEANUTS]: t("preferences.description.peanuts"),
    [Preferences.NUTS]: t("preferences.description.nuts"),
    [Preferences.SHELLFISH]: t("preferences.description.shellfish"),
    [Preferences.FISH]: t("preferences.description.fish"),
    [Preferences.SEAFOOD]: t("preferences.description.seafood"),
    [Preferences.SESAME]: t("preferences.description.sesame"),
    [Preferences.COELIAC]: t("preferences.description.coeliac"),
    [Preferences.SULPHITE]: t("preferences.description.sulphite"),
    [Preferences.MUSTARD]: t("preferences.description.mustard"),
    [Preferences.ALLIUM]: t("preferences.description.allium"),
    [Preferences.VEGETARIAN]: t("preferences.description.vegetarian"),
    [Preferences.VEGAN]: t("preferences.description.vegan"),
    [Preferences.PESCATARIAN]: t("preferences.description.pescatarian"),
    [Preferences.GLUTEN_FREE]: t("preferences.description.glutenFree"),
    [Preferences.LACTOSE_FREE]: t("preferences.description.lactoseFree"),
    [Preferences.DAIRY_FREE]: t("preferences.description.dairyFree"),
    [Preferences.FRUCTOSE_FREE]: t("preferences.description.fructoseFree")
});