import React, { useMemo } from 'react';
import {
	ActivityIndicator,
	FlatList,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	useColorScheme,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { fetchBooks, Book } from './hooks/useBooks';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const Tab = createMaterialTopTabNavigator();

function TabComponent({ route }) {
	const isDarkMode = useColorScheme() === 'dark';

	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};

	const { books } = route.params;

	return (
		<SafeAreaView style={backgroundStyle}>
			<View className="flex-1 items-center justify-center bg-white">
				{!books?.length
					? <Text>No books to show here</Text>
					: (
						<FlatList
							data={books}
							keyExtractor={(item) => `${item.id}`}
							contentContainerStyle={styles.listContainer}
							renderItem={({ item }) => (
								<View style={styles.itemContainer}>
									<Text style={styles.title}>
										{`Title: ${item.title}`}
									</Text>
									<View style={styles.line} />
									<View style={styles.bottomDetails}>
										<Text style={styles.author}>
											{`Author: ${item.author}`}
										</Text>
										<Text style={styles.date}>
											{item.publishedDate}
										</Text>
									</View>
								</View>
							)}
						/>
					)}
			</View>
		</SafeAreaView>
	);
}

export default function Books(): React.JSX.Element {

	const {
		isLoading,
		data: books,
		error,
		refetch,
		isRefetching,
	} = fetchBooks();

	const categorized = useMemo(() => {
		let categorized: { [k: string]: Book[]} = {};
		if (books?.length) {
			categorized = books?.reduce((prev, cur: Book) => {
				if (cur.genre) {
					if (prev?.[cur.genre]) {
						prev?.[cur.genre].push(cur);
					} else {
						prev[cur.genre] = [cur];
					}
				}
				return prev;
			}, {});
		}
		return categorized;
	}, [books]);

	if (isLoading || isRefetching || error || !books?.length) {
		return (
			<View style={styles.loadingContainer}>
				{(isLoading || isRefetching) ? (
					<>
						<ActivityIndicator color="#fbc344" size="large" />
						<Text style={styles.loadingText}>Fetching books...</Text>
					</>
				) : (
					<View style={styles.errorContainer}>
						<Text style={styles.errorTitle}>
							Error
						</Text>
						<Text style={styles.errorText}>
							An error occurred while fetching books
						</Text>
						<TouchableOpacity
							onPress={() => refetch()}
							style={{
								backgroundColor: '#fbc344',
								borderRadius: 8,
								padding: 16,
								marginTop: 16,
								width: '100%',
							}}
						>
							<Text style={styles.loadingText}>
								Try Again
							</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
		);
	}

	return (
		<Tab.Navigator
			initialRouteName={Object.keys(categorized)[0]}
			screenOptions={{
				tabBarLabelStyle: {
					fontSize: 12,
					color: 'black',
				},
				tabBarIndicatorStyle: {
					height: '100%',
					backgroundColor: '#fbc344',
					borderTopLeftRadius: 12,
					borderTopRightRadius: 12,
					borderBottomWidth: 12,
					borderBottomColor: '#fbc344',
				},
				tabBarStyle: {
					backgroundColor: 'white',
					borderBottomWidth: 16,
					borderBottomColor: '#fbc344',
				},
				tabBarAndroidRipple: {
					borderless: false,
				},
			}}
		>
			{Object.keys(categorized).map((key) => (
				<Tab.Screen
					key={key}
					name={key}
					component={TabComponent}
					initialParams={{ books: categorized[key], isLoading }}
				/>
			))}
    </Tab.Navigator>
	);
};

const styles = StyleSheet.create({
  listContainer: {
		margin: 16,
	},
	itemContainer: {
		backgroundColor: 'white',
		padding: 16,
		marginBottom: 16,
		borderRadius: 12,
	},
	title: {
		fontWeight: '700',
		fontSize: 18,
		color: '#bc9434',
		marginBottom: 8,
	},
	line: {
		height: 2,
		backgroundColor: '#e9e5da',
	},
	bottomDetails: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 8,
	},
	author: {
		color: '#7c5c23',
	},
	date: {
		color: '#907d56',
	},
	loadingContainer: {
		display: 'flex',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		fontSize: 16,
		color: 'black',
		marginLeft: 8,
		textAlign: 'center',
	},
	errorContainer: {
		display: 'flex',
		flexDirection: 'column',
	},
	errorTitle: {
		fontSize: 18,
		fontWeight: '700',
		color: 'black',
		textAlign: 'center',
	},
	errorText: {
		fontSize: 15,
		color: 'black',
		marginTop: 12,
		textAlign: 'center',
	},
});
