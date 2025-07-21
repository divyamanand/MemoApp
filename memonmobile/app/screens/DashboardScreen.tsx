import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const DashboardScreen = () => {
  const navigation = useNavigation()
  return (
    <View>
      <Text>DashboardScreen</Text>
      <Button
        title='Profile'
        onPress={() => navigation.navigate("Profile")}/>
      
       <Button
        title='Settings'
        onPress={() => navigation.navigate("Settings")}/>

        <Button
        title='Revise'
        onPress={() => navigation.navigate("Revision")}/>

         <Button
        title='About'
        onPress={() => navigation.navigate("About")}/>

         <Button
        title='Help'
        onPress={() => navigation.navigate("Help")}/>
    </View>
  )
}

export default DashboardScreen
