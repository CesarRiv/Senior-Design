import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import { logoutUser } from '../api/auth-api'
import Sentiment from 'sentiment'
import { TextInput, Text } from 'react-native'
import { TapGestureHandler } from 'react-native-gesture-handler'


const sentiment = new Sentiment();

export default class Dashboard extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
      sentimentScore:null,
      generalSentiment:null,


    };

    this.findSentiment = this.findSentiment.bind(this)
  }



  findSentiment=(event)=>{
    const result = sentiment.analyze(event.target.value)
    console.log(result)
    this.setState({
      sentimentScore: result.comparative
    })
    if(result.score<0) {
      this.setState({
        generalSentiment: 'Negative'
      })
    }
    else if(result.score>0) {
        this.setState({
          generalSentiment: 'Positive'
        })
    }
    else{
      this.setState({
        generalSentiment: 'Neutral'
      })
    }
  
  }

  render() {
    return(
    <Background>
      <Logo/>
      <Header>Sentimental App</Header>
      <Paragraph>
        Please enter how your day has been so far down below.
      </Paragraph>
      <TextInput 
      multiline={true}
      style={{height:200,borderColor:'black',broderWidth:10 }}
      placeholder="Type Here..."
      onChange={this.findSentiment}/>
      <Text>Sentiment Score: {this.state.sentimentScore}</Text>
      <Text>General Sentiment: {this.state.generalSentiment}</Text>

        <Button mode="outlined" onPress={logoutUser}>
          Logout
        </Button>
      </Background>
    )
  }
  }