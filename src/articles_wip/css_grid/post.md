# My learning path to mastering grid layout

## Responsiveness

### minmax()

won't shrink than the specified number and won't grow than the specified number

### auto-fill and auto-fit

auto-fill = create as many 200px columns as you can with the available space on that track. By default this won't fill up the extra space and it looks like there's a huge gap until it reaches enough room to add another column. That's where the minmax() function comes in handy. We can specify the smallest and the biggest size the cell is allowed to take up. If you say minmax(200px, 1fr) it won't get smaller than 200px but it is allowed to grow if there's available room. This solves the gap issue.

With fixed sizes there's a chance of overflow of the content. When you reach smaller screen sizes it might happen that your single column is still too big and it overflows. You can then use minmax(min(400px, 100%), 1fr). This is where readibility starts going out the window, but it basically makes sure that if the column has space that is less than 400px that it is allowed to shrink even further and choose whichever value is the smallest which is the 100% value, allowing it to shrink instead of overflowing.

repeat(auto-fit, minmax(300px, 1fr))
repeat(auto-fill, minmax(300px, 1fr)) will automatically fill in more columns on the track of the grid no matter if there are items to actually fill the available space in or not. This is handy if you apply filters to a list of products and want the cards to take up the same space even thought there are not enough elements to fill the entire row, thus causing them to stretch and look like different elements alltogether (https://www.youtube.com/watch?v=bj0Z_GncIwY)

Maybe it will add too many columns and you want to limit the amount of columns it will create on the fly for you. You can do a super complex calculation to limit the columns and make it fully responsible. (https://www.youtube.com/watch?v=CHULPvkXIRo&list=PL4-IK0AVhVjOSNeNSB0hAVMmRB102o47u&index=8)

## Forms

Using grid on the form wrapper element will automatically add the stretching effect on all elements. So everything is neatly stacked on top of each other and the input fields take up the entire width. Nice!
(https://www.youtube.com/watch?v=JHregeIsjPQ)

## Position absolute

Children with position absolute can still be positioned inside the grid

## Responsive layout without media queries

Having two elements that can grow to a certain width

```
&__container2 {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
    * {
        flex: 1;
        max-width: 200px;
        flex-basis: 200px;
    }
}
```

## When to use which?

(https://www.youtube.com/watch?v=3elGSZSWTbM)

![alt text](image.png)

"Go down the path of least resistance, where you not fight against what you're using so much" - Kevin Powell

# Sources

- https://www.joshwcomeau.com/css/interactive-guide-to-grid/
- https://www.youtube.com/watch?v=RhUuMl3R1PE
- https://www.youtube.com/watch?v=bj0Z_GncIwY
- https://www.youtube.com/watch?v=JHregeIsjPQ
- https://www.youtube.com/watch?v=CHULPvkXIRo&list=PL4-IK0AVhVjOSNeNSB0hAVMmRB102o47u&index=8
