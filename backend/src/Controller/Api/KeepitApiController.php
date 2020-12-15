<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

use App\Repository\ImageRepository;
use App\Entity\Image;

use App\Repository\UserRepository;
use App\Entity\User;

use App\Repository\TagRepository;
use App\Entity\Tag;

use App\Repository\KeepitRepository;
use App\Entity\Keepit;

class KeepitApiController extends AbstractController
{
    /**
     *
     * @Route("/keepit/add", methods={"POST"})
     */
    public function preload(
        Request $request, 
        ImageRepository $imageRepository, 
        TagRepository $tagRepository, 
        UserRepository $userRepository, 
        KeepitRepository $keepitRepository
        ) {

        $requestContent = json_decode($request->getContent(), true); 
        $tags = $requestContent['requestTags'];
        $imageIds = $requestContent['imageIds'];
        
        $user = $userRepository->login($requestContent['email'], $requestContent['password']);
        if ($user === null) {
            return new JsonResponse(
                ["error" => "User not found."],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $newKeepit = new Keepit();

        $newKeepit->setUser($user);
        if($tags){
            foreach($tags as $key => $value){
                $newTag = new Tag();
                $newTag->setValue($value['value']);
                $newTag->setIsCustom($value['isCustom']);
                $newTag->setUser($user);
                foreach($imageIds as $key => $value){
                    $newTag->setImage($imageRepository->findById($imageIds[$key]));
                }
                $newTag = $tagRepository->save($newTag);
                $newKeepit->addTag($newTag);
            }
        }

        $newAddedKeepit = $keepitRepository->save($newKeepit);
        foreach($imageIds as $key => $value){
            $image = $imageRepository->findById($imageIds[$key]);
            $image->setKeepit($newAddedKeepit);
            $image->setSubmitted(true);
            $imageRepository->save($image);
        }

        $response = new JsonResponse($newAddedKeepit);
        return $response;
    }

    /**
     *
     * @Route("/keepit/getall", methods={"POST"})
     */
    public function getall(
        Request $request, 
        ImageRepository $imageRepository, 
        TagRepository $tagRepository, 
        UserRepository $userRepository, 
        KeepitRepository $keepitRepository
        ) {

        $requestContent = json_decode($request->getContent(), true); 

        $user = $userRepository->login($requestContent['email'], $requestContent['password']);
        if ($user === null) {
            return new JsonResponse(
                ["error" => "User not found."],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $keepits = $keepitRepository->findby(["user" => $user->getId()]);
        
        $responseArr = array();
        foreach($keepits as $key => $keepit){
            $tags = $keepit->getTags();
            $images = $keepit->getImage();
            $responseArr[$key]['id'] = $keepit->id;
            foreach($images as $imageKey => $image){
                $responseArr[$key]['images'][$imageKey] = $image->getPath();
            }
            foreach($tags as $tagKey => $tag){
                $responseArr[$key]['tags'][$tagKey] = array( 'value' => $tag->getValue(), 'isCustom' => $tag->getIsCustom() );
            }
            if(count($tags) === 0){
                $responseArr[$key]['tags'][] = array( 'value' => 'Not Tagged', 'isCustom' => false);
            }
        }
        $response = new JsonResponse($responseArr);
        return $response;
    }
    
}


