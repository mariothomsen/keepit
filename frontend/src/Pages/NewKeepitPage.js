import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { apiGetVisionLabels, apiSaveKeepit } from '../Services/apiRequests.js'
import styled from 'styled-components/macro'
import Taglist from '../Components/Taglist'
import CustomTagForm from '../Components/CustomTagForm'
import Footer from '../Components/Footer'
import BackButton from '../Components/BackButton'
import SearchButton from '../Components/SearchButton'
import SaveButtonFooter from '../Components/SaveButtonFooter'
import TagSeparator from '../Components/TagSeparator'
import useTags from '../Hooks/useTags'

export default function NewKeepitPage() {
  const history = useHistory()
  const [images, setImages] = useState([])
  const [imageIds, setImageIds] = useState([])

  const { addedTags, newTags, handleSubmitTag, updateTag, setTags } = useTags()

  useEffect(() => {
    loadApiLabels()
  }, [])

  function handleApiTags(response) {
    const uniqueApiTags = [...new Set(response.labels)]
    const expandedTags = uniqueApiTags.map((value, index) => {
      return { value: value, added: false, isCustom: false }
    })
    setTags(expandedTags)
    setImageIds(response.ids)
  }

  function loadApiLabels() {
    const historyImages = history.location.state.images
    if (historyImages) {
      setImages(historyImages)
      history.replace('/new', { images: '' })
      const files = historyImages
      const labelRequest = {
        email: 'user@email',
        password: 'test',
        files,
      }
      apiGetVisionLabels(labelRequest)
        .then((result) => handleApiTags(result))
        .catch((error) => console.log('error', error))
    }
  }

  const StyledTagList = styled(Taglist)`
    background-color: red !important;
    height: 400px;
  `

  return (
    <>
      <main>
        {images &&
          images.map((image, index) => (
            <div key={index}>
              <img src={image['data_url']} alt="" width="200" />
              <br></br>
              <button onClick={() => removeImage(index)}>Remove</button>
            </div>
          ))}
        <Taglist
          as={StyledTagList}
          onClick={updateTag}
          tags={addedTags}
          targetState={false}
        ></Taglist>
        <TagSeparator />
        <Taglist
          onClick={updateTag}
          tags={newTags}
          targetState={true}
        ></Taglist>
        <CustomTagForm onSubmit={handleSubmitTag} />
      </main>
      <Footer
        actionButtonText="Save Keepit"
        actionButton={<SaveButtonFooter onClick={saveKeepit} />}
        left={<BackButton height="30px" width="30px" />}
        right={<SearchButton />}
      ></Footer>
    </>
  )

  function saveKeepit() {
    const requestTags = addedTags.map((addedTag) => {
      return { value: addedTag.value, isCustom: addedTag.isCustom }
    })
    const request = {
      email: 'user@email',
      password: 'test',
      requestTags,
      imageIds,
    }
    apiSaveKeepit(request)
      .then((result) => handleApiTags(result))
      .catch((error) => console.log('error', error))
    history.push('/')
  }

  function removeImage(deleteIndex) {
    setImages(images.filter((image, index) => index !== deleteIndex))
    images.length - 1 === 0 && setTags([])
  }
}
