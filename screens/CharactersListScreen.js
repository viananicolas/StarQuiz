import React, { Component } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Icon, List, Text } from "react-native-elements";
import { getAllPeople } from "../actions";
import CardList from "../components/CardList";

export default class CharactersListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  renderCharactersView = () => {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{flex: 1}}>
        <CardList />
      </ScrollView>
    );
  };
  render() {
    return this.renderCharactersView();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  },
  albumMenu: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  }
});