import React from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Alert,
  Modal,
  TouchableHighlight,
  KeyboardAvoidingView
} from "react-native";
import {
  Button,
  Card,
  Icon,
  Input,
  Image,
  Text,
  Overlay,
  ListItem
} from "react-native-elements";
import { getAllPeople, storeData, retrieveData } from "../actions";
import { Audio } from "expo";

export default class CardList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      people: [],
      peopleOpenedDetail: [],
      peopleCorrectAnswers: [],
      inputValue: "",
      emailInputValue: "",
      totalPoints: 0,
      isFetching: false,
      page: 1,
      modalVisible: false,
      character: {},
      time: "",
      hasMoreCharacters: true,
      gameEnded: false
    };
  }
  componentDidMount = async () => {
    this.countdown();
    await this.getAllCharacters();
  };
  getAllCharacters = async () => {
    try {
      let { page, people } = this.state;
      const peopleTemp = await getAllPeople(page);
      if (!peopleTemp) {
        this.setState({ hasMoreCharacters: false });
      } else {
        people = people.concat(peopleTemp);
        this.setState({ people });
      }
    } catch (error) {
      this.setState({ hasMoreCharacters: false });
    }
  };
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }
  countdown() {
    // var countDownDate = this.addMinutes(new Date(new Date().setSeconds(0,0)), 2);
    var countDownDate = new Date(
      new Date().setSeconds(new Date().getSeconds() + 123, 0)
    );
    var x = setInterval(() => {
      let time = "";
      var now = new Date().getTime();
      var distance = countDownDate - now;
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = ("0" + Math.floor((distance % (1000 * 60)) / 1000)).slice(
        -2
      );
      time = minutes + ":" + seconds;
      console.log(time);
      if (distance < 0) {
        clearInterval(x);
        time = "Encerrado";
        let { gameEnded } = this.state;
        gameEnded = true;
        this.setState({ gameEnded });
      }
      this.setState({ time });
    }, 1000);
  }
  getCharacterName = async characterName => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require("../assets/sounds/lightsaber.mp3"));
      let {
        inputValue,
        totalPoints,
        peopleOpenedDetail,
        peopleCorrectAnswers
      } = this.state;

      if (
        inputValue.toLowerCase() === characterName.toLowerCase() &&
        !peopleCorrectAnswers.includes(characterName)
      ) {
        peopleOpenedDetail.includes(characterName)
          ? (totalPoints += 5)
          : (totalPoints += 10);
        peopleCorrectAnswers.push(characterName);
        this.setState({ totalPoints });
        this.setState({ peopleCorrectAnswers });
        await soundObject.playAsync();
      } else {
        Alert.alert("Valor incorreto ou resposta já acertada");
      }
    } catch (error) {
      console.log(error);
    }
  };

  getImage(url) {
    return `https://starwars-visualguide.com/assets/img/characters/${url
      .split("/people/")[1]
      .replace("/", "")}.jpg`;
  }

  onInputChange = inputValue => {
    this.setState({ inputValue });
  };
  onEmailInputChange = emailInputValue => {
    this.setState({ emailInputValue });
  };

  chosenCharacterDetails(character) {
    let { peopleOpenedDetail } = this.state;
    peopleOpenedDetail.push(character.name);
    this.setState({ character });
    this.setState({ peopleOpenedDetail });
    this.setModalVisible(true);
  }

  handleLoadMore = async () => {
    let { page, hasMoreCharacters } = this.state;
    if (hasMoreCharacters) {
      page++;
      this.setState({ page });
      setTimeout(async () => {
        await this.getAllCharacters();
      }, 1000);
    }
  };

  saveInfo = async () => {
    try {
      const { inputValue, emailInputValue, totalPoints } = this.state;
      if (!inputValue) Alert.alert("Aviso", "Digite o seu nome");
      else {
        let user = {
          name: inputValue,
          email: emailInputValue,
          totalPoints: totalPoints
        };
        let users = await retrieveData("users");
        users.push(user);
        users = await storeData("users", users);
        console.log(users);
        if (users) {
          Alert.alert("Aviso", "Salvo com sucesso.");
          this.props.navigation.goBack();
        }
      }
    } catch (error) {
      Alert.alert("Aviso", "Erro ao salvar dados");
    }
  };

  renderCharacters = () => {
    const { people, totalPoints, time, gameEnded } = this.state;
    return (
      <View style={{ paddingBottom: 100 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20
          }}
        >
          <Text>Tempo: {time}</Text>
          <Text>Pontos: {totalPoints}</Text>
        </View>
        {!gameEnded && (
          <FlatList
            data={people}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <Card key={index} style={styles.cardStyle}>
                  <Image
                    style={{ height: 450, padding: 0 }}
                    resizeMode="cover"
                    source={{ uri: this.getImage(item.url) }}
                  />
                  <Button
                    icon={<Icon name="code" color="#ffffff" />}
                    disabled={gameEnded}
                    backgroundColor="#03A9F4"
                    buttonStyle={{
                      borderRadius: 0,
                      marginLeft: 0,
                      marginRight: 0,
                      marginBottom: 0
                    }}
                    title="Ver Detalhes"
                    onPress={() => this.chosenCharacterDetails(item)}
                  />
                  <Input
                    placeholder="Escreva sua aposta"
                    editable={!gameEnded}
                    leftIcon={<Icon name="person" size={24} color="black" />}
                    onChangeText={inputValue => {
                      this.onInputChange(inputValue);
                    }}
                    // value={this.state.inputValue}
                    onSubmitEditing={e => {
                      this.getCharacterName(item.name);
                    }}
                  />
                </Card>
              );
            }}
            onEndReached={this.handleLoadMore}
            onEndThreshold={0}
          />
        )}
        {gameEnded && (
          <KeyboardAvoidingView>
            <Input
              placeholder="Nome"
              leftIcon={<Icon name="person" size={24} color="black" />}
              onChangeText={inputValue => {
                this.onInputChange(inputValue);
              }}
            />
            <Input
              placeholder="Email"
              leftIcon={<Icon name="email" size={24} color="black" />}
              textContentType="emailAddress"
              keyboardType="email-address"
              onChangeText={inputValue => {
                this.onEmailInputChange(inputValue);
              }}
            />
            <Button
              icon={<Icon name="save" color="#ffffff" />}
              backgroundColor="#03A9F4"
              buttonStyle={{
                borderRadius: 0,
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 0
              }}
              title="Salvar"
              onPress={() => this.saveInfo()}
            />
          </KeyboardAvoidingView>
        )}
        {this.renderModal()}
      </View>
    );
  };

  renderModal = () => {
    let { character } = this.state;
    return (
      <Overlay
        animationType="slide"
        transparent={false}
        isVisible={this.state.modalVisible}
        onRequestClose={() => {
          console.log("closed");
        }}
        onBackdropPress={() => this.setModalVisible(!this.state.modalVisible)}
      >
        <View
          style={{
            marginTop: 22,
            padding: 10,
            alignItems: "center",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <View
            // style={{
            //   width: 300,
            //   height: 300
            // }}
          >
            <Text>Height: {character.height}</Text>
            <Text>Weight: {character.mass}</Text>
            <Text>Hair color: {character.hair_color}</Text>
            <Text>Skin color: {character.skin_color}</Text>
            <Text>Eyes color: {character.eye_color}</Text>
            <Text>Birth year: {character.birth_year}</Text>
            <Text>Gender: {character.gender}</Text>
            <TouchableHighlight>
              <Button
                icon={<Icon name="arrow-back" color="#ffffff" />}
                backgroundColor="#03A9F4"
                buttonStyle={{
                  borderRadius: 0,
                  marginLeft: 0,
                  marginRight: 0,
                  marginBottom: 0
                }}
                title="Fechar"
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              />
            </TouchableHighlight>
          </View>
        </View>
      </Overlay>
    );
  };
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
  cardStyle: {}
});
