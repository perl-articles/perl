import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'
import Popups from '/components/partials/Popups'
import Notifications from '/components/partials/Notifications'
import Header from '/components/partials/Header'
import SideMenu from '/components/partials/SideMenu'
import Views from '/components/partials/Views'
import Footer from '/components/partials/Footer'
import Login from '/components/views/Login'
import {localStorageGet} from '../api/browser'
import state from '../store/state'
import { createObserver } from 'dop'
import {setHref} from '/store/actions'
import routes from '/router/routes'

function show() {
    let scanner = new Instascan.Scanner({
        video: document.getElementById('cam')
    })
    scanner.addListener('scan', function(content) {
        console.log(content)
    })
    Instascan.Camera.getCameras()
        .then(function(cameras) {
            if (cameras.length > 0) {
                scanner.start(cameras[0])
            } else {
                console.error('No cameras found.')
            }
        })
        .catch(function(e) {
            console.error(e)
        })
}

function loginView() {
    return (
        <Background>
            <Header />
            <Login />
        </Background>
    );
}

function mainView() {
    return (
        <Background>
            <Notifications />
            <SideMenu />
            <Header />
            <Views />
            <Footer />
            <Popups />
        </Background>
    )
}

export default class App extends Component {
    componentWillMount() {
        this.state = {
            isLoggedIn: state.isLoggedIn
        }

        const observer = createObserver(mutations => {
            this.state.isLoggedIn = state.isLoggedIn
            this.forceUpdate()
            setHref(routes.home())
        })
        observer.observe(state, 'isLoggedIn')

        if(localStorageGet('profile')) {
            this.state.isLoggedIn = true
        } else {
            setHref(routes.login())
        }
    }

    render() {
        if(this.state.isLoggedIn) {
            return mainView();
        } else {
            return loginView();
        }
        
    }
}

const Background = styled.div`
    height: 100%;
    background: linear-gradient(to bottom, #007196 150px, #d7dbd5 150px);
`
