import React, { Component, PropTypes } from 'react'
import AsyncProps from 'async-props'
import fetch from 'isomorphic-fetch'
import MissingView from './missing-view'

export default class Loader extends Component {

  static loadProps({ params, loadContext }, cb) {

    const baseUrl = `${loadContext.siteUrl}/wp-json/wp/v2`

    let url = `pages?filter[name]=home`
    if (parseInt(loadContext.frontPage))
      url = `pages/${loadContext.frontPage}`
    else if (typeof loadContext.frontPage === 'string')
      url = `pages?filter[name]=${loadContext.frontPage}`

    // LoadContext is basicaly an object we can pass around
    // the sever with our components and some baseUrl on it
    return fetch(`${baseUrl}/${url}`)
      .then(resp => resp.json())
      .then(resp => {
        const data = ('0' in resp) || resp instanceof Array ?
          { data: resp[0] } :
          { resp }
        return cb(null, data)
      })
      .catch(error => cb(error))
  }

  render () {
    const Tag = this.props.route.tag
    return Tag ?
      <Tag {...this.props.data} /> :
      <MissingView {...this.props.data} />
  }
}

Loader.propTypes = {
  route: PropTypes.shape({
    tag: PropTypes.func
  }).isRequired,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ])
}