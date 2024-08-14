BLOCK ELEMENTS:
    1> can have it's own height, width.
    2> takes full width.
    3> margin works on all direction.
    4> padding works on all direction.
    5> Successive elements fall to next line.
    e.g. <div>, <p>, <h1> ... <h6>, <ul>, <ol>, <li>, <hr>, <main>, <nav>, <aside>, <section>, <footer>

INLINE ELEMENTS:
    1> Take size as that required by the contents.
    2> Can't set manual height and width.
    3> margin-inline works as expected but margin-block has got no effect
    4> padding-inline works as expected but padding-block increases its height and makes it overlap with top element doesn't matter if box-sizing is border-box. In short, padding top and bottom also doesn't work like margin top and bottom.
    5> Elements follow side by side alignment i.e wraps in case no width is available for side-by-side alignment.
    e.g. <a>, <em>, <strong>, <sub>, <sup>, <label>, <button>, <input>, <textarea>, <img>

INLINE BLOCK:
    1> Similar to inline element. However,
        i> can set width and height
        ii> can have margin and padding in all direction.
    2> Will stack itself horizontally just like inline elements.

BOX-MODEL:
    1> content
    2> padding
    3> border
    4> margin

BOX-SIZING: How width and height of an element is calculated.
    1> content-box: 
        i> default value
        ii> Final width after adding margin, padding and border is greater than applied width.
        iii> The applied width is applied only to the content.
    1> border-box
        i> Width is considered after applying all the border, margin and padding.

POSITION:
    1> Static:
        i> default value
        ii> can't position the element any where, the element would remain it's natural page flow position.
        iii> no effect of top/bottom/left/right/z-index
    2> Relative
        i> Element remains at its original position of the page just like static position.
        ii> However, we can apply top/bottom/left/right/z-index.
        iii> The positional properties moves the element from the original position in that direction. However, the orginal postion keeps vacant
             and other's can't occupy it.
    3> Absolute
        i> The element is removed from the flow of the document.
        ii> Othe elements will behave as if the the positioned absolute element is not even present in document.
        iii> we can apply top/bottom/left/right/z-index.
        iv> The element would be positioned relative to a parent which some position property applied to it.
    4> Fixed
        i> The element is removed from the flow of the document just like absolute position.
        ii> Quite exaclty the same as absolute poistion except for the fact that:
            a> Always positions itself relative to the document/view-port and not any parent.
            b> Remains un-affected by scrolling. It always stays in the same place even if the page is scrolled. 
            c> Got nothing to do with parent scroll container.
    5> Sticky
        i> acts like position: relative until an element is scrolled beyond a specific offset, in which case it turns into position: fixed, causing the element to "stick" to its position instead of being scrolled out of view.
        ii> It only acts as sticky as long as it is inside the parent container.

<-----OVERLAY--------->

<div class="image-container">
    <img src="path/to/your-image.jpg" alt="Your Image">
    <div class="overlay"></div>
</div>

.image-container {
  position: relative;
  width: 300px; /* Set the desired width for the container */
  height: 200px; /* Set the desired height for the container */
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Adjust the alpha value to change the opacity of the overlay */
}

<-----OVERLAY--------->


- animation on display none to block
- animation on image load
- grid-template-columns(200px fit-content(40ch), 1fr)
- text-wrap: pretty / balanced
- white-space
- image property: {object-fit: cover, object-position: center, inline-size: 100%, block-size: 100%}
- scroll-snape
- border-image
- accent-color


<----For Text wrapping with hyphens------>
overflow-wrap: 'break-word'
hypen: auto


white-speace: property