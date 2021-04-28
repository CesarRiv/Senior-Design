'use strict'
import React, { Component, useState } from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import { logoutUser } from '../api/auth-api'
import { DataTable } from 'react-native-paper'
import { TextInput } from 'react-native-gesture-handler'
import Sentiment from 'sentiment'



const sentiment = new Sentiment();
const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.constinous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';






class Dashboard extends Component {





  constructor(props){
    super(props);
    this.state = {
      sentimentScore:null,
      generalSentiment:null,
      listening: false
    };
    this.toggleListen = this.toggleListen.bind(this)
    this.handleListen = this.handleListen.bind(this)
    this.findSentiment = this.findSentiment.bind(this)
  }

  toggleListen(){
    this.setState({
      listening: !this.state.listening
    }, this.handleListen)
  }

  handleListen() {

    console.log('listening?', this.state.listening)

    if (this.state.listening) {
      recognition.start()
      recognition.onend = () => {
        console.log("...continue listening...")
        recognition.start()
      }

    } else {
      recognition.stop()
      recognition.onend = () => {
        console.log("Stopped listening per click")
      }
    }

    recognition.onstart = () => {
      console.log("Listening!")
    }

    let finalTranscript = ''
    recognition.onresult = event => {
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + ' ';
        else interimTranscript += transcript;
      }
      document.getElementById('interim').innerHTML = interimTranscript
      document.getElementById('final').innerHTML = finalTranscript

    //-------------------------COMMANDS------------------------------------

      const transcriptArr = finalTranscript.split(' ')
      const stopCmd = transcriptArr.slice(-3, -1)
      console.log('stopCmd', stopCmd)

      if (stopCmd[0] === 'stop' && stopCmd[1] === 'listening'){
        recognition.stop()
        recognition.onend = () => {
          console.log('Stopped listening per command')
          const finalText = transcriptArr.slice(0, -3).join(' ')
          document.getElementById('final').innerHTML = finalText
        }
      }
    }
    
  //-----------------------------------------------------------------------
    
    recognition.onerror = event => {
      console.log("Error occurred in recognition: " + event.error)
    }

  }

  findSentiment(event){
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
      <textarea onChange={this.findSentiment}/>
      <p>Sentiment Score: {this.state.sentimentScore}</p>
      <p>General Sentiment: {this.state.generalSentiment}</p>
      <Button mode="outlined">
          Submit Entry
        </Button>
      <div style={container}>
        <button id='microphone-btn' style={button} onClick={this.toggle} />
        <div id='interim' style={interim}></div>
        <div id='final' style={final}></div>
      </div>
        <Button mode="outlined" onPress={logoutUser}>
          Logout
        </Button>
      </Background>
    )
  }
  }

export default Dashboard


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  button: {
    width: '60px',
    height: '60px',
    background: 'lightblue',
    borderground: 'lightblue',
    borderRadius: '50%',
    margin: '6em 0 2em 0'
  },
  interim: {
    color: 'gray',
    border: '#ccc 1px solid',
    padding: '1em',
    margin: '1em',
    width: '300px'
  },
  final: {
    color: 'black',
    border: '#ccc 1px solid',
    padding: '1em',
    margin: '1em',
    width: '300px'
  }
}

const { container,button,interim,final } = styles