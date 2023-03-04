# BSB
## (주)BA Energy ESS 모니터링 페이지 외주 용역 개발
배터리 모니터링 페이지 제작

## Todo
* 온습도 차트 멋있는걸로
* 가운데 4칸 짜리 탭 (이미지, 지도)
* 통신 : api call
* 방식 : key 기준으로 (온습도 / 지도) request하면 서버에서 그에 맞는 response
* 추가사항 : 카드 하단에 수평 4칸 짜리 가스 데이터 표현 수치 or 그래프 구현

## Reference
* Template from -> https://startbootstrap.com/template/sb-admin
* Chart from -> https://echarts.apache.org/en/index.html

## MockUP
![화면 캡처 2022-11-10 225033](https://user-images.githubusercontent.com/71891870/201109172-a13c7ca8-c8a5-4f5f-bef6-8c8cd6525607.png)

## raw
![raw](https://user-images.githubusercontent.com/71891870/201953606-3fc1aedd-fa45-472b-bba3-89ba61990e6b.png)

## Version proto
![customized](https://user-images.githubusercontent.com/71891870/201953622-cfba9f65-9bac-44a6-bfa2-693817ee6b55.png)

## Version 2
![v2](https://user-images.githubusercontent.com/71891870/202223325-702b3584-f16a-4fed-9c7d-16185fd1226a.png)

## Final Design (Theme)
### Light Mode
![light](https://user-images.githubusercontent.com/71891870/209642602-8db4aff6-4fad-4aa4-ad66-31dac8e0e623.png)

### Dark Mode
![dark](https://user-images.githubusercontent.com/71891870/209642678-73029b42-f614-4b33-8141-78817d19b92e.png)

## Trouble Shooting
* 페이지를 768px(col-md) 이하로 줄였을 때 현재 시간을 표시하는 부분이 표시가 안됨
* 원인 대충 파악함 -> 부트스트랩 템플릿 CSS 파일에 @media라는 문법들이 있는데 이게 if와 똑같은 의미임
* 여기서 페이지 크기가 769px 이하로 내려가면 수행되는 css 코드들이 있는데 이것 때문에 그러는 것 같음
* 현재시간 표시하는 부분은 내가 직접 작성한 코드라 원래 템플릿 css와 뭔가 맞지 않는 부분이 있는 것 같음 -> 그 부분 찾는 중
* (해결) -> 일단 원인은 media 문법에 있는 코드가 맞는데 부트스트랩의 그리드 레이아웃의 각 픽셀별로 요소들을 반응형으로 만들어 주는 코드들이 있다
* 약 10000 줄 정도되는 코드인데 여기에 화면 사이즈가 특정 픽셀의 이상 또는 이하가 되면 display:none으로 되는 코드가 있다
* 이걸 다 찾아서 없애기에는 무리가 있어서 삽질 계속 함 -> 크롬에서 개발자 모드를 키고 현재시간을 표시하는 부분이 없어질때 해당 요소의 디자인 탭에 d-none이 표시되는걸 발견함 -> 그래서 코드를 보니까 문제의 현재시간 출력 부분의 div 태그에 class에 d-none가 대놓고 있었다 -> 없애니깐 바로 해결됨 끝.

* 정리 -> 부트스트랩 탬플릿에서 브라우저의 픽셀이 바뀌면 화면의 요소들을 반응형을 위해 변경하는데, 위 시간을 출력하는 요소의 부모 요소가 768px 이하로 가면 display:none으로 바뀌게끔 되어있다. 근데 난 이 10000줄 정도 되는 코드중에서 하나하나 바꿀려고 했다. 근데 그게 아니라 그냥 해당 @media를 호출하게 하는 클래스를 지웠으면 되는 거였음
