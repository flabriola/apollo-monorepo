import { useEffect, useState } from "react";
import { useRestaurant } from "../RestaurantContext";
import { MainContainer, Title, PreferenceGroup, SearchBar, Text, PreferenceItem, PreferencesList, SearchInput, PreferencesContainer, Header } from "./styles";
import { useTranslation } from "react-i18next";
import { allergies, diets } from "../../../shared/restaurant/data";
import { getPreferenceIcon } from "../../../hooks/getPreferenceIcon";
import { Preferences, PreferencesNames, PreferencesDescriptions } from "../../../shared/restaurant/types";

// Currently only supports allergies and diets, to support Ingredients:
// Create a new field in db and db query that says whether restuarant allows ingredients filtering
// Create new ingredient groups in preferences, these should act like diets and allergies, type and data
// read and apply this to the rendering of ingredients title and it's section
// update search results
function PreferencesSelector() {

    const { t } = useTranslation();
    const { setPreferencesState, userPreferences, setUserPreferences } = useRestaurant();
    const [preferenceGroup, setPreferenceGroup] = useState<"allergens" | "diets" | "ingredients">("allergens");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResults, setSearchResults] = useState<Preferences[]>(allergies.concat(diets));

    useEffect(() => {
        if (userPreferences && userPreferences.preferences && userPreferences.preferences.length > 0) {
            setPreferencesState("preferences_with_selection");
        } else {
            setPreferencesState("preferences");
        }
    }, [userPreferences]);

    const handlePreferenceClick = (preference: Preferences) => {
        if (userPreferences && userPreferences.preferences && userPreferences.preferences.includes(preference)) {
            setUserPreferences({
                ...userPreferences,
                preferences: userPreferences.preferences.filter((p: Preferences) => p !== preference)
            });
        } else {
            setUserPreferences({
                ...userPreferences,
                preferences: [...userPreferences.preferences, preference]
            });
        }
    }

    // Search for preferences
    useEffect(() => {
        if (!searchQuery.trim()) {
            // If search query is empty, show original list
            setSearchResults(allergies.concat(diets));
            return;
        }

        const query = searchQuery.toLowerCase().trim();
        const allPreferences = allergies.concat(diets);

        // Filter and sort preferences based on priority
        const filteredResults = allPreferences
            .filter((preference) => {
                const name = PreferencesNames[preference].toLowerCase();
                const description = PreferencesDescriptions[preference].toLowerCase();

                // Check if query matches the name first
                if (name.includes(query)) {
                    return true;
                }

                // If no match in name, check description
                if (description && description.includes(query)) {
                    return true;
                }

                return false;
            })
            .sort((a, b) => {
                const nameA = PreferencesNames[a].toLowerCase();
                const nameB = PreferencesNames[b].toLowerCase();

                // Priority 1: Exact matches
                const exactMatchA = nameA === query;
                const exactMatchB = nameB === query;
                if (exactMatchA && !exactMatchB) return -1;
                if (!exactMatchA && exactMatchB) return 1;

                // Priority 2: Matches that start with the query
                const startsWithA = nameA.startsWith(query);
                const startsWithB = nameB.startsWith(query);
                if (startsWithA && !startsWithB) return -1;
                if (!startsWithA && startsWithB) return 1;

                // Priority 3: Maintain original order for remaining matches
                return 0;
            });

        setSearchResults(filteredResults);
    }, [searchQuery]);

    return (
        <MainContainer>
            <Title>{t("preferencesSelector.title")}</Title>
                <PreferenceGroup>
                    <Text onClick={() => setPreferenceGroup("allergens")} selected={preferenceGroup === "allergens"}>{t("preferencesSelector.allergens")}</Text>
                    |
                    <Text onClick={() => setPreferenceGroup("diets")} selected={preferenceGroup === "diets"}>{t("preferencesSelector.diets")}</Text>
                    {false && (
                        <>
                            |
                            <Text onClick={() => setPreferenceGroup("ingredients")} selected={preferenceGroup === "ingredients"}>{t("preferencesSelector.ingredients")}</Text>
                        </>
                    )}
                </PreferenceGroup>
                {/* TODO: fix clear button styling */}
                <SearchBar>
                    {searchQuery && (
                        <Text
                            selected={false}
                            onClick={() => setSearchQuery("")}
                            style={{
                                opacity: 0
                            }}
                        >
                            clear
                        </Text>
                    )}
                    <SearchInput
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <Text
                            selected={false}
                            onClick={() => setSearchQuery("")}
                            style={{
                                fontFamily: "var(--font-family-tertiary)",
                                fontSize: "var(--font-size-sm)",
                                fontWeight: "var(--font-weight-light)"
                            }}
                        >
                            clear
                        </Text>
                    )}
                </SearchBar>
            <PreferencesContainer>
                <PreferencesList>
                    {preferenceGroup === 'allergens' && !searchQuery && (
                        allergies.map((allergen) => {
                            const isSelected = userPreferences && userPreferences.preferences && userPreferences.preferences.includes(allergen);
                            return (
                                <PreferenceItem
                                    selected={isSelected}
                                    onClick={() => handlePreferenceClick(allergen)}
                                >
                                    {getPreferenceIcon(allergen, 25, isSelected ? "var(--color-negative)" : "var(--color-black)")} {PreferencesNames[allergen]}
                                </PreferenceItem>
                            )
                        })
                    )}

                    {preferenceGroup === 'diets' && !searchQuery && (
                        diets.map((diet) => {
                            const isSelected = userPreferences && userPreferences.preferences && userPreferences.preferences.includes(diet);
                            return (
                                <PreferenceItem
                                    selected={isSelected}
                                    onClick={() => handlePreferenceClick(diet)}
                                >
                                    {getPreferenceIcon(diet, 25, isSelected ? "var(--color-negative)" : "var(--color-black)")} {PreferencesNames[diet]}
                                </PreferenceItem>
                            )
                        })
                    )}

                    {/* TODO: add ingredients */}
                    {preferenceGroup === 'ingredients' && !searchQuery && (
                        <div></div>
                    )}

                    {searchQuery && (
                        searchResults.map((item) => {
                            const isSelected = userPreferences && userPreferences.preferences && userPreferences.preferences.includes(item);
                            return (
                                <PreferenceItem
                                    selected={isSelected}
                                    onClick={() => handlePreferenceClick(item)}
                                >
                                    {getPreferenceIcon(item, 25, isSelected ? "var(--color-negative)" : "var(--color-black)")} {PreferencesNames[item]}
                                </PreferenceItem>
                            )
                        })
                    )}
                </PreferencesList>
            </PreferencesContainer>
        </MainContainer>
    );
}

export default PreferencesSelector;