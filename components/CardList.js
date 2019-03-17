import React from "react";
import { FlatList, StyleSheet, View, Alert } from "react-native";
import { Button, Card, Icon, Input, Image, Text } from "react-native-elements";
import { getAllPeople } from "../actions";

export default class CardList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      people: [],
      inputValue: "",
      points: 0,
      isFetching: false,
      page: 1
    };
  }
  componentDidMount = async () => {
    await this.getAllCharacters();
    // await this.handleLoadMore();
  };
  getAllCharacters = async () => {
    let { page, people } = this.state;
    const peopleTemp = await getAllPeople(page);
    people = people.concat(peopleTemp);
    this.setState({ people });
  };

  renderCharacters = () => {
    const { people } = this.state;
    return (
      <FlatList
        data={people}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <Card
              key={index}
              // title={item.title}
              // image={{ uri: this.getImage(item.url) }}
              
              style={styles.cardStyle}
            >
            <Image
            style={{height: 550, padding: 0}}
            resizeMode="cover"
            source={{ uri: this.getImage(item.url) }}
          />
              <Button
                icon={<Icon name="code" color="#ffffff" />}
                backgroundColor="#03A9F4"
                buttonStyle={{
                  borderRadius: 0,
                  marginLeft: 0,
                  marginRight: 0,
                  marginBottom: 0
                }}
                title="Ver Detalhes"
                onPress={()=>Alert.alert("oi", "eu sou o Goku")}
              />
              <Input
                placeholder="Escreva sua aposta"
                leftIcon={<Icon name="person" size={24} color="black" />}
                onChangeText={inputValue => {
                  this.onInputChange(inputValue);
                }}
                onSubmitEditing={e =>{this.getCharacterName(item.name)}}

              />
            </Card>
          );
        }}
        onEndReached={this.handleLoadMore}
        onEndThreshold={0}
      />
    );
  };
  getCharacterName(characterName){
    const {inputValue} = this.state;
    console.log(inputValue);
    console.log(characterName);
  }
  getImage(url) {
    return `https://starwars-visualguide.com/assets/img/characters/${url
      .split("/people/")[1]
      .replace("/", "")}.jpg`;
  }
  onInputChange = inputValue => {
    this.setState({ inputValue });
  };
  handleLoadMore = async () =>{
    let { page } = this.state;
    console.log(page);
    page++;
    console.log(page);
    this.setState({page});
    // await this.getAllCharacters();

    setTimeout(async () => {
      await this.getAllCharacters();
    }, 1000);
  }
  render() {
    const { people } = this.state;
    if (people && people.length > 0) return this.renderCharacters();
    return (
      <View>
        <Text />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  cardStyle: {
    height: 400
  }
});
