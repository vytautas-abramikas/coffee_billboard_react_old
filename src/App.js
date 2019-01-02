import React, { Component } from 'react'
import './App.css'
import coffeeData from './coffeeData'

function MakeCoffee(props){
  return (
    <div className="coffee_container">
      <img src={props.item.url} alt={props.item.name}/>
      <h3>{props.item.price}€</h3>
      <p>{props.item.name}</p>
      <button 
        name={props.item.id}
        className="remove"
        onClick={() => props.removeCoffee(props.item.id)}
      >
      remove
      </button>
    </div>
  )
}

function MakeOption(props){
  return(
    <option value={props.item.id}>{props.item.name} - {props.item.price}€</option>
  )
}

function StoreUserData(userData){
  localStorage.setItem("userData", JSON.stringify(userData))
}

class App extends Component {

  constructor() {
    super()
    this.state = {
      coffeesAll: coffeeData,
      userData: [],
      freeId: 0,
      selected: 0
    }
    this.removeCoffee = this.removeCoffee.bind(this)
    this.selectCoffee = this.selectCoffee.bind(this)
    this.addCoffee = this.addCoffee.bind(this)
    this.getUserData = this.getUserData.bind(this)
  }

  selectCoffee(event){
    const id = event.target.value
    this.setState(prevState => {
      return {
        selected: parseInt(id)
      }
    })
  }

  addCoffee(event){
    event.preventDefault()
    this.setState(prevState => {
      const coffeeFromMenu = this.state.coffeesAll.filter((item) => item.id === this.state.selected)

      const coffeeToAdd = {
      id: this.state.freeId,
      name: coffeeFromMenu[0].name,
      price: coffeeFromMenu[0].price,
      url: coffeeFromMenu[0].url
      }

      const usedIds = this.state.freeId
      const updatedList = prevState.userData
      updatedList.push(coffeeToAdd)
      StoreUserData(updatedList)

      return {
        userData: updatedList,
        freeId: usedIds + 1
      }
    })
  }

  removeCoffee(id){
    this.setState(prevState => {
      const shortenedList = prevState.userData.filter((item) => item.id !== id)
      StoreUserData(shortenedList)
      return {
        userData: shortenedList
      }
    })
  }

  getUserData(){
    if (this.state.userData.length === 0){ 
      if (localStorage.getItem("userData") !== null){
        if (localStorage.getItem("userData").length > 2){
          this.setState(() => {
            const dataFromLocal = JSON.parse(localStorage.getItem("userData"))
            return {
              userData: dataFromLocal
            }
          })
        }
      }
    }
  }

  componentDidMount() {
     this.getUserData()
  }

  render() {
    const coffeePrice = this.state.userData.map(item => item.price).reduce((a, b) => a + b, 0).toFixed(2)
    const buyingList = this.state.userData.map((item, index) => 
      <MakeCoffee key={"coffee"+index} item={item} removeCoffee={this.removeCoffee} />)

    const optionsList = this.state.coffeesAll.map((menuItem, index) => 
      <MakeOption key={"menu"+index} item={menuItem} />)

    return (
      <div className="App">
        <header>
          <h1>Coffee Billboard</h1>
          <h2>Price: {coffeePrice}€</h2>
          <form>
            <select onChange={this.selectCoffee}>
                {optionsList}    
            </select>
            <button onClick={this.addCoffee}>Add</button>
            <button className="pay">Pay</button>
          </form>
        </header>
        <div className="content_container">
          {buyingList}
        </div>
      </div>
    )
  }
}

export default App