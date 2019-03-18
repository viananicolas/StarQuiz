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
        <CardList navigation={this.props.navigation} />
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
    paddingTop: 5,
    backgroundColor: "#fff"
  }
});
